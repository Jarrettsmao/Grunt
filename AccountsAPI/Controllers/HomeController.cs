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
[Route("")]
public class HomeController: Controller {
    
    // private readonly MongoDBService _mongoDBService;
    private readonly IConfiguration _configuration;
    // private readonly JwtService _jwtService;
    public HomeController(IConfiguration configuration) {
        // _mongoDBService = mongoDBService;
        _configuration = configuration;
        // _jwtService = jwtService;
    }

    //serving static files
    [HttpGet("Home")]
    public IActionResult GetAccountPage(){
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
        "wwwroot", "HTML", "home.html"), "text/html");
    }
}