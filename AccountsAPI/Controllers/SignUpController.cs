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
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace AccountsAPI.Controllers;

[Controller]
[Route("Accounts")]
public class SignUpController : Controller
{

    private readonly MongoDBService _mongoDBService;
    private readonly IConfiguration _configuration;
    private readonly JwtService _jwtService;
    public SignUpController(MongoDBService mongoDBService, IConfiguration configuration, JwtService jwtService)
    {
        _mongoDBService = mongoDBService;
        _configuration = configuration;
        _jwtService = jwtService;
    }
    //general GET request
    [HttpGet]
    public async Task<List<UserInfo>> Get()
    {
        return await _mongoDBService.GetAsync();
    }
    [HttpPost("SignUpReq")]
    public async Task<IActionResult> Post([FromBody] UserInfo userInfo)
    {
        bool created = await _mongoDBService.CreateAsync(userInfo);
        if (!created)
        {
            return Conflict(new { message = "Email in use" });
        }
        return CreatedAtAction(nameof(Get), new { id = userInfo.Id }, userInfo);
    }
    [Authorize]
    [HttpPut("Edit/Username")]
    public async Task<IActionResult> EditUsername([FromBody] EditUsernameRequest request)
    {
        if (string.IsNullOrEmpty(request.id))
        {
            return BadRequest(new { message = "User ID is required" });
        }

        var user = await _mongoDBService.GetUserByIdAsync(request.id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }
        await _mongoDBService.AddToUserInfoAsync(request.id, request.username);
        return Ok(new { message = "Username updated successfully", username = request.username });
    }
    [Authorize]
    [HttpPut("Edit/AreaCode")]
    public async Task<IActionResult> EditAreaCode([FromBody] EditAreaCodeRequest request)
    {
        if (string.IsNullOrEmpty(request.id))
        {
            return BadRequest(new { message = "User ID is required" });
        }

        var user = await _mongoDBService.GetUserByIdAsync(request.id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }
        await _mongoDBService.EditAreaCodeAsync(request.id, request.areacode);
        return Ok(new { message = "Area Code updated successfully", areacode = request.areacode });
    }
    [Authorize]
    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete([FromBody] DeleteRequest deleteRequest)
    {
        if (string.IsNullOrEmpty(deleteRequest.id))
        {
            return BadRequest(new { message = "User ID is required" });
        }

        var user = await _mongoDBService.GetUserByIdAsync(deleteRequest.id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        await _mongoDBService.DeleteAsync(deleteRequest.id);
        return NoContent();
    }

    [HttpPost("LoginReq")]
    public async Task<IActionResult> Login([FromBody] LoginReq loginRequest)
    {
        var user = await _mongoDBService.GetUserByEmailAsync(loginRequest.email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.password, user.password))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        //Generate a hashed version of user ID
        // string hashedUserId = GenerateHashedId(user.Id);

        //redirect user to unique account page
        string userRedirectUrl = $"/Accounts/{user.username}";

        var token = _jwtService.GenerateToken(user);
        return Ok(new
        {
            message = "Login successful",
            // username = user.username, 
            // id = user.Id,
            redirectUrl = userRedirectUrl,
            token
        });
    }

    [Authorize]
    [HttpGet("ValidateToken")]
    public IActionResult ValidateToken()
    {
        return Ok(new { message = "Token is valid" });
    }

    //serving static files
    [HttpGet("{username}")]
    public IActionResult GetAccountPage(string username)
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "accountpage.html"), "text/html");
    }

    [HttpGet("Login")]
    public IActionResult GetLoginPage(string username)
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "login.html"), "text/html");
    }

    [HttpGet("Signup")]
    public IActionResult GetSignUpPage(string username)
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "signup.html"), "text/html");
    }

    // [Authorize]
    [HttpGet("{username}/Settings")]
    public IActionResult GetSettingsPage(string username)
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "settings.html"), "text/html");
    }
}

