using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
namespace TodoApi.Models;

public class UserInfo{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string username { get; set; } = null!;
    public string password { get; set; } = null!;
    public DateTime createdDate { get; set; } = DateTime.UtcNow;
}