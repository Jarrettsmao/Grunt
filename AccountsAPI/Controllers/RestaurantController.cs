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
[Route("Restaurants")]
public class RestaurantController: Controller {
    private readonly RestaurantService _restaurantService;
    private readonly IConfiguration _configuration;
    private readonly JwtService _jwtService;
    public RestaurantController(RestaurantService restaurantService, IConfiguration configuration, JwtService jwtService) {
        _restaurantService = restaurantService;
        _configuration = configuration;
        _jwtService = jwtService;
    }

    // [Authorize]
    // [HttpGet]
    // public async Task<List<RestaurantInfo>> Get(){
    //     return await _restaurantService.GetAsync();
    // }

    //change authorize
    // [Authorize]
    [HttpPost("CreateReq")]
    public async Task<IActionResult> CreateRestaurant([FromBody] RestaurantInfo restaurantInfo) {

        //needs to also get restaurant id and set it

        // if (string.IsNullOrEmpty(userId)){
        //     return Unauthorized("Invalid token - no user ID found");
        // }

        await _restaurantService.CreateRestaurantAsync(restaurantInfo);
        return Ok(new { message = "Restaurant created successfully!"});
    }

    //serving static files

    [HttpGet("Page")]
    public IActionResult GetRestaurantPage(){
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "restaurant.html"), "text/html");
    }

    // [Authorize]
    // [HttpGet("UserReviews")]
    // public async Task<List<ReviewInfo>> GetUserReviews(string id){     
    //     var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    //     if (string.IsNullOrEmpty(userId))
    //     {
    //         return new List<ReviewInfo>(); // Or return BadRequest() if you want to handle this case differently
    //     }

    //     return await _reviewService.GetReviewsByAuthorIdAsync(userId);
    // }
}