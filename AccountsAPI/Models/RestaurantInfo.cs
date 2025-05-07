using Microsoft.Extensions.Logging.Abstractions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
namespace AccountsAPI.Models;

public class RestaurantInfo{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string restaurantId {get; set; } = null!;
    public string restaurantName {get; set; } = null!;
    public DateTime createdDate { get; set; } = DateTime.UtcNow;
}