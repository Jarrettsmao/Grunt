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

    public async Task<bool> CreateAsync(UserInfo userInfo) {
        var user = await GetUserByEmailAsync(userInfo.email);

        if (user != null){
            return false;
        }
        userInfo.password = BCrypt.Net.BCrypt.HashPassword(userInfo.password);
        await _userCollection.InsertOneAsync(userInfo);
        return true;
    }

    public async Task AddToUserInfoAsync(string id, string un) {
        if (string.IsNullOrEmpty(un)) {
            throw new ArgumentException("Username cannot be null or empty.");
        }
        
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("Id", id);
        UpdateDefinition<UserInfo> update = Builders<UserInfo>.Update.Set<string>("username", un);
        await _userCollection.UpdateOneAsync(filter, update);
        return;
    }

    public async Task EditAreaCodeAsync(string id, string ac) {
        if (string.IsNullOrEmpty(ac)) {
            throw new ArgumentException("Areacode cannot be null or empty.");
        }
        
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("Id", id);
        UpdateDefinition<UserInfo> update = Builders<UserInfo>.Update.Set<string>("areacode", ac);
        await _userCollection.UpdateOneAsync(filter, update);
        return;
    }

    public async Task DeleteAsync(string id) {
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("Id", id);
        await _userCollection.DeleteOneAsync(filter);
        return;
    } 

    public async Task<UserInfo?> GetUserByEmailAsync(string email){
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("email", email);
        return await _userCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserInfo?> GetUserByIdAsync(string id){
        FilterDefinition<UserInfo> filter = Builders<UserInfo>.Filter.Eq("Id", id);
        return await _userCollection.Find(filter).FirstOrDefaultAsync();
    }
}
