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
[Route("Reviews")]
public class ReviewController: Controller {
    private readonly ReviewService _reviewService;
    private readonly IConfiguration _configuration;
    private readonly JwtService _jwtService;
    public ReviewController(ReviewService reviewService, IConfiguration configuration, JwtService jwtService) {
        _reviewService = reviewService;
        _configuration = configuration;
        _jwtService = jwtService;
    }

    // [Authorize]
    [HttpGet]
    public async Task<List<ReviewInfo>> Get(){
        return await _reviewService.GetAsync();
    }

    [Authorize]
    [HttpPost("PostReq")]
    public async Task<IActionResult> CreateReview([FromBody] ReviewInfo reviewInfo) {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //needs to also get restaurant id and set it

        if (string.IsNullOrEmpty(userId)){
            return Unauthorized("Invalid token - no user ID found");
        }

        reviewInfo.authorId = userId;

        await _reviewService.CreateReviewAsync(reviewInfo);
        return Ok(new { message = "Review submitted successfully!"});
    }

    //serving static files
    // [HttpGet("{restaurantName}")]
    [HttpGet("restaurantName")]
    public IActionResult GetAccountPage(string username){
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "restaurantpage.html"), "text/html");
    }
}