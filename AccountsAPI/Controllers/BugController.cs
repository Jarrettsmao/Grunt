using AccountsAPI.Models;
using AccountsAPI.Services;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccountsAPI.Controllers;

[Controller]
[Route("Bugs")]
public class BugController : Controller
{
    private readonly BugService _bugService;

    public BugController(BugService bugService)
    {
        _bugService = bugService;
    }

    [HttpGet]
    public async Task<List<BugReport>> GetAllBugReportsAsync()
    {
        return await _bugService.GetAsync();
    }

    [HttpPost("MakeReport")]
    public async Task<IActionResult> MakeReport([FromBody] BugReport bugReport) {
        await _bugService.CreateBugReportAsync(bugReport);
        return Ok(new { message = "Report created successfully!"});
    }
}

