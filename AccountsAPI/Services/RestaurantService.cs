using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using AccountsAPI.Models;
using AccountsAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AccountsAPI.Services;

public class RestaurantService {
    
    private readonly IMongoCollection<RestaurantInfo> _restaurantCollection;
    private readonly MongoDBService _mongoDBService;

    public RestaurantService(IOptions<MongoDBSettings> mongoDBSettings, MongoDBService mongoDBService) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        
        _restaurantCollection = database.GetCollection<RestaurantInfo>("Restaurants"); // Collection for restaurants

        _mongoDBService = mongoDBService;
    }

    public async Task<List<RestaurantInfo>> GetAsync() {
        return await _restaurantCollection.Find(new BsonDocument()).ToListAsync();
    }
    public async Task<bool> CreateRestaurantAsync(RestaurantInfo restaurantInfo) {

        await _restaurantCollection.InsertOneAsync(restaurantInfo);
        return true;
    }

    public async Task<RestaurantInfo> GetByRestaurantIdAsync(string id){
        FilterDefinition<RestaurantInfo> filter = Builders<RestaurantInfo>.Filter.Eq("restaurantId", id);
        return await _restaurantCollection.Find(filter).FirstOrDefaultAsync();
    }
}