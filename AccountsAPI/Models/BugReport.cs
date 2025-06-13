using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
namespace AccountsAPI.Models;

public class BugReport{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string report { get; set; } = null!;
    public DateTime createdDate { get; set; } = DateTime.UtcNow;
}