using System.Text;
using AccountsAPI.Models;
using AccountsAPI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Newtonsoft.Json;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

//Add MongoDB settings, services, and authentication
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<MongoDBService>();
builder.Services.AddSingleton<ReviewService>();
builder.Services.AddSingleton<RestaurantService>();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.WithOrigins("https://localhost:8080")  // Allow all origins (for development purposes, you can restrict later)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});


// Add services to the container.
builder.Services.AddControllers();

//enables JWT tokens
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],       // NO space after :
        ValidAudience = builder.Configuration["Jwt:Audience"],   // NO space after :
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])
        ),
        ValidateIssuerSigningKey = true
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            var token = context.Request.Headers["Authorization"].ToString();
            Console.WriteLine($"Token received: {token}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddScoped<JwtService>();

//Register HttpClient for OpenAI API calls
builder.Services.AddHttpClient();

//Register the new service for OpenAI interaction
builder.Services.AddSingleton<OpenAIService>();

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Enable CORS globally
app.UseCors("AllowAll");

//Enable static file serving
app.UseStaticFiles();

app.MapControllers();

app.Run();
