using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using AccountsAPI.Models;
using AccountsAPI.Models.DTOs;

namespace AccountsAPI.Services;

public class MongoDBService {
    
    private readonly IMongoCollection<UserInfo> _userCollection;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        
        _userCollection = database.GetCollection<UserInfo>("Accounts"); // Collection for Accounts
    }

    public async Task<List<UserInfo>> GetAsync() {
        return await _userCollection.Find(new BsonDocument()).ToListAsync();
    }

    public async Task CreateAsync(UserInfo userInfo) {
        await _userCollection.InsertOneAsync(userInfo);
    }

    public async Task AddToUserInfoAsync(string id, string pw) {
        if (string.IsNullOrEmpty(pw)) {
            throw new ArgumentException("Password cannot be null or empty.");
        }
        
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("Id", id);
        UpdateDefinition<UserInfo> update = Builders<UserInfo>.Update.Set<string>("password", pw);
        await _userCollection.UpdateOneAsync(filter, update);
        return;
    }

    public async Task DeleteAsync(string id) {
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("Id", id);
        await _userCollection.DeleteOneAsync(filter);
        return;
    } 

    public async Task<UserInfo?> GetUserByUsernameAsync(string username){
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("username", username);
        return await _userCollection.Find(filter).FirstOrDefaultAsync();
    }
}
