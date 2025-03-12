using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[Controller]
[Route("SignUp")]
public class SignUpController: Controller {
    
    private readonly MongoDBService _mongoDBService;
    public SignUpController(MongoDBService mongoDBService) {
        _mongoDBService = mongoDBService;
    }
    [HttpGet]
    public async Task<List<UserInfo>> Get() {
        return await _mongoDBService.GetAsync();
    }
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] UserInfo userInfo) {
        await _mongoDBService.CreateAsync(userInfo);
        return CreatedAtAction(nameof(Get), new { id = userInfo.Id }, userInfo);
    }
    // [HttpPut("{id}")]
    // public async Task<IActionResult> Edit(string id, [FromBody] string movieId) {}
    // [HttpDelete("{id}")]
    // public async Task<IActionResult> Delete(string id) {}
}

