using System.Text;
using AccountsAPI.Models;
using AccountsAPI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<MongoDBService>();

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
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

//enables tokens
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
        OnMessageReceived = context =>
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length);
                Console.WriteLine($"Stripped Token: {token}");
                context.Token = token; // 🔥 THIS IS THE CRUCIAL LINE 🔥
            }
            else
            {
                Console.WriteLine("No valid Bearer token found.");
            }

            return Task.CompletedTask;
        },

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

builder.Services.AddAuthorization();

var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Enable CORS globally
app.UseCors("AllowAll");

//Enable static file serving
app.UseStaticFiles();

app.MapControllers();

app.Run();
