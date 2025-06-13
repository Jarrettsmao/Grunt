using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using AccountsAPI.Models;

namespace AccountsAPI.Services;

public class BugService
{

    private readonly IMongoCollection<BugReport> _bugsCollection;

    public BugService(IOptions<MongoDBSettings> mongoDBSettings, MongoDBService mongoDBService)
    {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);

        _bugsCollection = database.GetCollection<BugReport>("Bugs"); // Collection for restaurants
    }
    public async Task<List<BugReport>> GetAsync()
    {
        return await _bugsCollection.Find(new BsonDocument()).ToListAsync();
    }
    
    public async Task<bool> CreateBugReportAsync(BugReport bugReport) {
        await _bugsCollection.InsertOneAsync(bugReport);
        return true;
    }

}