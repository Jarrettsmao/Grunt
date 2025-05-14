using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using AccountsAPI.Models;
using AccountsAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AccountsAPI.Services;

public class ReviewService {
    
    private readonly IMongoCollection<ReviewInfo> _reviewsCollection;
    private readonly MongoDBService _mongoDBService;
    private readonly RestaurantService _restaurantService;

    public ReviewService(RestaurantService restaurantService, IOptions<MongoDBSettings> mongoDBSettings, MongoDBService mongoDBService) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        
        _reviewsCollection = database.GetCollection<ReviewInfo>("Reviews"); // Collection for Reviews

        _mongoDBService = mongoDBService;
        _restaurantService = restaurantService;
    }

    public async Task<List<ReviewInfo>> GetAsync() {
        return await _reviewsCollection.Find(new BsonDocument()).ToListAsync();
    }
    public async Task<bool> CreateReviewAsync(ReviewInfo reviewInfo) {
        await _reviewsCollection.InsertOneAsync(reviewInfo);

        var restaurant = await _restaurantService.GetByRestaurantIdAsync(reviewInfo.restaurantId);

        int newTotalReviews = restaurant.totalReviews + 1;
        double newAvgRating = ((restaurant.averageRating * restaurant.totalReviews) + reviewInfo.rating) / newTotalReviews;
        await _restaurantService.UpdateRating(reviewInfo.restaurantId, newTotalReviews, newAvgRating);
        return true;
    }

    public async Task<List<ReviewInfo>> GetReviewsByAuthorIdAsync(string id){
        var filter = Builders<ReviewInfo>.Filter.Eq(nameof(ReviewInfo.authorId), id);
        return await _reviewsCollection.Find(filter).ToListAsync();
    }

    public async Task<List<ReviewInfo>> GetReviewsByRestaurantIdAsync(string id){
        var filter = Builders<ReviewInfo>.Filter.Eq(nameof(ReviewInfo.restaurantId), id);
        return await _reviewsCollection.Find(filter).ToListAsync();
    }

    public async Task CheckRestaurantAsync(string restaurantId, string restaurantName){
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(restaurantId);
        if (restaurant == null) {
            var newRestaurant = new RestaurantInfo {
                restaurantId = restaurantId,
                restaurantName = restaurantName,
                createdDate = DateTime.UtcNow
            };

            await _restaurantService.CreateRestaurantAsync(newRestaurant);
        }
    }

    public async Task<double> GetRestaurantRatingByPlaceIdAsync(string id){
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(id);

        if(restaurant == null){
            throw new Exception("Restaurant not found");
        }
        return restaurant.averageRating;
    }

    public async Task<double> GetRestaurantNumReviewsByPlaceIdAsync(string id){
        var restaurant = await _restaurantService.GetByRestaurantIdAsync(id);

        if(restaurant == null){
            throw new Exception("Restaurant not found");
        }
        return restaurant.totalReviews;
    }
}