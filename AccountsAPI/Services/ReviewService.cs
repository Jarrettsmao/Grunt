using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using AccountsAPI.Models;
using AccountsAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AccountsAPI.Services;

public class ReviewService
{

    private readonly IMongoCollection<ReviewInfo> _reviewsCollection;
    private readonly MongoDBService _mongoDBService;
    private readonly RestaurantService _restaurantService;

    public ReviewService(RestaurantService restaurantService, IOptions<MongoDBSettings> mongoDBSettings, MongoDBService mongoDBService)
    {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);

        _reviewsCollection = database.GetCollection<ReviewInfo>("Reviews"); // Collection for Reviews

        _mongoDBService = mongoDBService;
        _restaurantService = restaurantService;
    }

    public async Task<List<ReviewInfo>> GetAsync()
    {
        return await _reviewsCollection.Find(new BsonDocument()).ToListAsync();
    }

    public async Task<bool> CreateReviewAsync(ReviewInfo reviewInfo)
    {
        await _reviewsCollection.InsertOneAsync(reviewInfo);

        var restaurant = await _restaurantService.GetByRestaurantIdAsync(reviewInfo.restaurantId);

        int newTotalReviews = restaurant.totalReviews + 1;
        double newAvgRating = ((restaurant.averageRating * restaurant.totalReviews) + reviewInfo.rating) / newTotalReviews;
        await _restaurantService.UpdateRating(reviewInfo.restaurantId, newTotalReviews, newAvgRating);
        return true;
    }

    public async Task<ReviewInfo> GetReviewByIdAsync(string id)
    {
        var filter = Builders<ReviewInfo>.Filter.Eq(nameof(ReviewInfo.authorId), id);
        return await _reviewsCollection.Find(filter).FirstOrDefaultAsync();
    }   


    public async Task<List<ReviewInfo>> GetReviewsByAuthorIdAsync(string id)
    {
        var filter = Builders<ReviewInfo>.Filter.Eq(nameof(ReviewInfo.authorId), id);
        return await _reviewsCollection.Find(filter).ToListAsync();
    }

    public async Task<List<ReviewInfo>> GetReviewsByRestaurantIdAsync(string id)
    {
        var filter = Builders<ReviewInfo>.Filter.Eq(nameof(ReviewInfo.restaurantId), id);
        return await _reviewsCollection.Find(filter).ToListAsync();
    }

    public async Task CheckRestaurantAsync(string restaurantId, string restaurantName)
    {
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(restaurantId);
        if (restaurant == null)
        {
            var newRestaurant = new RestaurantInfo
            {
                restaurantId = restaurantId,
                restaurantName = restaurantName,
                createdDate = DateTime.UtcNow
            };

            await _restaurantService.CreateRestaurantAsync(newRestaurant);
        }
    }

    public async Task<double> GetRestaurantRatingByPlaceIdAsync(string id)
    {
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(id);

        if (restaurant == null)
        {
            return 0.0;
        }
        return restaurant.averageRating;
    }

    public async Task<double> GetRestaurantNumReviewsByPlaceIdAsync(string id)
    {
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(id);

        if (restaurant == null)
        {
            return 0.0;
        }
        return restaurant.totalReviews;
    }
    
    public async Task DeleteAsync(string id)
    {
        // Delete the review
        FilterDefinition<ReviewInfo> filter = Builders<ReviewInfo>.Filter.Eq("Id", id);
        var reviewInfo = await _reviewsCollection.FindOneAndDeleteAsync(filter);

        // Check if the review exists
        if (reviewInfo == null){
            throw new Exception("Review not found.");
        }

        // Get the associated restaurant
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(reviewInfo.restaurantId);

        // Check if the restaurant exists
        if (restaurant == null){
            throw new Exception("Restaurant not found.");
        }

        // Update the total reviews and average rating
        int newTotalReviews = restaurant.totalReviews - 1;
        double newAvgRating;
        if (newTotalReviews != 0){
            newAvgRating = ((restaurant.averageRating * restaurant.totalReviews) - reviewInfo.rating) / newTotalReviews;
        }
        else{
            newAvgRating = 0;
        }

        await _restaurantService.UpdateRating(reviewInfo.restaurantId, newTotalReviews, newAvgRating);

        return;
    }

}