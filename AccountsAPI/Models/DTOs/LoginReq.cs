namespace AccountsAPI.Models.DTOs;
public class LoginReq
{
    public string? email { get; set; } = null!;
    public string username { get; set; } = null!;
    public string password { get; set; } = null!;
}
