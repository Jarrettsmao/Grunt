// using MongoExample.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using TodoApi.Models; 

namespace TodoApi.Services;

public class MongoDBService {
    
    private readonly IMongoCollection<UserInfo> _userCollection;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        
        _userCollection = database.GetCollection<UserInfo>("Users"); // Collection for users
    }

    public async Task<List<UserInfo>> GetAsync() {
        return await _userCollection.Find(new BsonDocument()).ToListAsync();
    }

    public async Task CreateAsync(UserInfo userInfo) {
        await _userCollection.InsertOneAsync(userInfo);
    }

    public async Task AddToUserInfoAsync(string id, string movieId) {
        // Implement this method if needed
    }

    public async Task DeleteAsync(string id) {
        // Implement deletion logic
    }
}
