using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
namespace AccountsAPI.Models;

public class UserInfo{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("email")]
    public string email { get; set; } = null!;
    [BsonElement("username")]
    public string username { get; set; } = null!;
    [BsonElement("password")]
    public string password { get; set; } = null!;
    public DateTime createdDate { get; set; } = DateTime.UtcNow;
}