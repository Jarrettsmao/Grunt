using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System;
using TodoApi.Models;
using TodoApi.Models.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers;

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
        await _mongoDBService.CreateAsync(userInfo);
        return CreatedAtAction(nameof(Get), new { id = userInfo.Id }, userInfo);
    }
    [HttpPut("Edit/{id}")]
    public async Task<IActionResult> Edit(string id, [FromBody] EditPasswordRequest request) {
        await _mongoDBService.AddToUserInfoAsync(id, request.Password);
        return NoContent();
    }
    // [HttpDelete("{id}")]
    // public async Task<IActionResult> Delete(string id) {}
}

