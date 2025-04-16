namespace AccountsAPI.Models;

public class MongoDBSettings {

    public string ConnectionURI { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string AccountsCollectionName { get; set; } = null!;
    public string ReviewsCollectionName { get; set; } = null!;

}