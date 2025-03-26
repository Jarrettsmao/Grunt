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

namespace AccountsAPI.Controllers;

[Controller]
[Route("Accounts")]
public class SignUpController: Controller {
    
    private readonly MongoDBService _mongoDBService;
    public SignUpController(MongoDBService mongoDBService) {
        _mongoDBService = mongoDBService;
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

        if (user == null || user.password != loginRequest.password){
            return Unauthorized(new { message = "Invalid email or password"});
        }

        return Ok(new { message = "Login successful", username = user.username, id = user.Id });
    }
}

