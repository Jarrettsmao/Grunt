using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System;
using AccountsAPI.Models;
using AccountsAPI.Models.DTOs;
using AccountsAPI.Services;
using Microsoft.AspNetCore.Identity.Data;
using BCrypt.Net;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace AccountsAPI.Controllers;

[Controller]
[Route("Accounts")]
public class SignUpController: Controller {
    
    private readonly MongoDBService _mongoDBService;
    private readonly IConfiguration _configuration;
    public SignUpController(MongoDBService mongoDBService, IConfiguration configuration) {
        _mongoDBService = mongoDBService;
        _configuration = configuration;
    }
    //general GET request
    [HttpGet]
    public async Task<List<UserInfo>> Get() {
        return await _mongoDBService.GetAsync();
    }
    [HttpPost("SignUp")]
    public async Task<IActionResult> Post([FromBody] UserInfo userInfo) {
        bool created = await _mongoDBService.CreateAsync(userInfo);
        if (!created){
            return Conflict(new { message = "Email in use"});
        }
        return CreatedAtAction(nameof(Get), new { id = userInfo.Id }, userInfo);
    }
    [HttpPut("Edit/Username")]
    public async Task<IActionResult> EditUsername([FromBody] EditUsernameRequest request) {
        if (string.IsNullOrEmpty(request.id)){
            return BadRequest(new { message = "User ID is required"});
        }

        var user = await _mongoDBService.GetUserByIdAsync(request.id);
        if (user == null){
            return NotFound(new { message = "User not found"});
        }
        await _mongoDBService.AddToUserInfoAsync(request.id, request.username);
        return Ok(new { message = "Username updated successfully", username = request.username });
    }
    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete([FromBody] DeleteRequest deleteRequest) {
        if (string.IsNullOrEmpty(deleteRequest.id)){
            return BadRequest(new { message = "User ID is required"});
        }

        var user = await _mongoDBService.GetUserByIdAsync(deleteRequest.id);
        if (user == null){
            return NotFound(new { message = "User not found"});
        }
        
        await _mongoDBService.DeleteAsync(deleteRequest.id);
        return NoContent();
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginReq loginRequest){
        var user = await _mongoDBService.GetUserByEmailAsync(loginRequest.email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.password, user.password)){
            return Unauthorized(new { message = "Invalid email or password"});
        }

        // var token = GenerateJwtToken(user);
        return Ok(new { message = "Login successful", username = user.username, id = user.Id/*, token*/});
    }

    // private string GenerateJwtToken(UserInfo user){
    //     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
    //     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    //     var claims = new[]
    //     {
    //         new Claim(ClaimTypes.Name, user.username),
    //         new Claim("UserId", user.Id.ToString())
    //     };

    //     var token = new SecurityTokenDescriptor(
    //         issuer: "yourdomain.com",
    //         AudienceValidator: "yourdomain.com",
    //         claims: claims,
    //         expires: DateTime.UtcNow.AddHours(1),
    //         SigningCredentials: creds
    //     );

    //     return new JwtSecurityTokenHandler().WriteToken(token);
    // }
}

