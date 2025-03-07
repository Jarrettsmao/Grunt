using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System;

namespace TodoApi.Controllers
{
    public class UserLoginInfo {
        public string Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedDate {get; set; }

        // Constructor to initialize properties
        public UserLoginInfo()
        {
            Id = string.Empty; // Ensures no null values
            Email = string.Empty;
            PasswordHash = string.Empty;
            CreatedDate = DateTime.UtcNow;
        }
    }

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        // private readonly AppDbContext _context;
        // private readonly PasswordHasher<User> _passwordHasher;

        // public AuthController(AppDbContext context)
        // {
        //     _context = context;
        //     _passwordHasher = new PasswordHasher<User>();
        // }

        // [HttpPost("signup")]
        // public async Task<IActionResult> SignUp([FromBody] SignUpDto model)
        // {
        //     // if (!ModelState.IsValid)
        //     //     return BadRequest(ModelState);

        //     // // Check if user already exists
        //     // if (await _context.Users.AnyAsync(u => u.Email == model.Email))
        //     //     return BadRequest("Email already in use.");

        //     // Create new user
        //     var user = new UserLoginInfo
        //     {
        //         Email = model.Email,
        //         Username = model.Username,
        //         // PasswordHash = _passwordHasher.HashPassword(null, model.Password)
        //     };

        //     await _usersCollection.InsertOneAsync(user);

        //     return Ok(new { message = "User registered successfully!" });
        // }
    }
}

// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using System.ComponentModel.DataAnnotations;
// using System.Threading.Tasks;

// namespace MyApp.Controllers
// {
//     [ApiController]
//     [Route("api/auth")]
//     public class AuthController : ControllerBase
//     {
//         private readonly AppDbContext _context;
//         private readonly PasswordHasher<User> _passwordHasher;

//         public AuthController(AppDbContext context)
//         {
//             _context = context;
//             _passwordHasher = new PasswordHasher<User>();
//         }

//         [HttpPost("signup")]
//         public async Task<IActionResult> SignUp([FromBody] SignUpDto model)
//         {
//             if (!ModelState.IsValid)
//                 return BadRequest(ModelState);

//             // Check if user already exists
//             if (await _context.Users.AnyAsync(u => u.Email == model.Email))
//                 return BadRequest("Email already in use.");

//             // Create new user
//             var user = new User
//             {
//                 Email = model.Email,
//                 Username = model.Username,
//                 PasswordHash = _passwordHasher.HashPassword(null, model.Password)
//             };

//             _context.Users.Add(user);
//             await _context.SaveChangesAsync();

//             return Ok(new { message = "User registered successfully!" });
//         }
//     }

//     public class SignUpDto
//     {
//         [Required]
//         [EmailAddress]
//         public string Email { get; set; }

//         [Required]
//         [MinLength(3)]
//         public string Username { get; set; }

//         [Required]
//         [MinLength(6)]
//         public string Password { get; set; }
//     }

//     public class User
//     {
//         public int Id { get; set; }
//         public string Email { get; set; }
//         public string Username { get; set; }
//         public string PasswordHash { get; set; }
//     }

//     public class AppDbContext : DbContext
//     {
//         public DbSet<User> Users { get; set; }

//         public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
//     }
// }

