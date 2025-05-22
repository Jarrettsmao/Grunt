namespace AccountsAPI.Models.DTOs;

public class ReviewDeleteRequest
{
    public string id { get; set; } = null!;
    public string restaurantId { get; set; } = null!;
}

