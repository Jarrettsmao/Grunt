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

    public ReviewService(IOptions<MongoDBSettings> mongoDBSettings, MongoDBService mongoDBService) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        
        _reviewsCollection = database.GetCollection<ReviewInfo>("Reviews"); // Collection for Reviews

        _mongoDBService = mongoDBService;
    }

    public async Task<List<ReviewInfo>> GetAsync() {
        return await _reviewsCollection.Find(new BsonDocument()).ToListAsync();
    }
    public async Task<bool> CreateReviewAsync(ReviewInfo reviewInfo) {
        //needs to first take info from jwt 

        await _reviewsCollection.InsertOneAsync(reviewInfo);
        return true;
    }

    public async Task<List<ReviewInfo>> GetReviewsByAuthorIdAsync(string id){
        var filter = Builders<ReviewInfo>.Filter.Eq(nameof(ReviewInfo.authorId), id);
        return await _reviewsCollection.Find(filter).ToListAsync();
    }
}