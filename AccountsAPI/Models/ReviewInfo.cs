using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
namespace AccountsAPI.Models;

public class ReviewInfo{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]

    public string? Id { get; set; }
    public string? authorId {get; set; }
    public string restaurantId {get; set; } = null!;
    public string reviewText {get; set; } = null!;
    public int rating {get; set; }
    public DateTime createdDate { get; set; } = DateTime.UtcNow;
}