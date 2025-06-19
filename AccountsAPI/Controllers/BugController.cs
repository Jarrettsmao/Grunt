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

    [Authorize]
    [HttpPost("MakeReport")]
    public async Task<IActionResult> MakeReport([FromForm] BugReportReq brr) {
        var bugReport = new BugReport();

        bugReport.report = brr.report;

        // Console.WriteLine("running");
        // Console.WriteLine(brr.picture);
        
        if (!string.IsNullOrEmpty(brr.picture))
        {
            try
            {
                bugReport.picture = Convert.FromBase64String(brr.picture);
            }
            catch (FormatException ex)
            {
                return BadRequest("Invalid Base64 string format");
            }
        }

        await _bugService.CreateBugReportAsync(bugReport);
        return Ok(new { message = "Report created successfully!"});
    }
}

