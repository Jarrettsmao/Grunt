using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
using System;
namespace AccountsAPI.Models;

[BsonIgnoreExtraElements]
public class RestaurantInfo{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string restaurantId {get; set; } = Guid.NewGuid().ToString();
    public string restaurantName {get; set; } = null!;
    [BindNever]
    public int totalReviews {get; set; } = 0;
    [BindNever]
    public double averageRating {get; set; } = 0.0;
    public DateTime createdDate { get; set; } = DateTime.UtcNow;
}