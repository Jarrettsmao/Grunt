using MongoExample.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System;

namespace MongoExample.Services;

public class MongoDBService {

    private readonly IMongoCollection<Accounts> _accountsCollection;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        _accountsCollection = database.GetCollection<Accounts>(mongoDBSettings.Value.CollectionName);
    }

    public async Task<List<Accounts>> GetAsync() { }
    public async Task CreateAsync(UserInfo userInfo) { }
    // public async Task AddToAccountsAsync(string id, string email, string password, DateTime createdDate) {}
    public async Task DeleteAsync(string id) { }

}