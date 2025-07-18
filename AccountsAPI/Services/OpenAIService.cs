using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using AccountsAPI.Models;
using AccountsAPI.Models.DTOs;

namespace AccountsAPI.Services;

public class OpenAIService{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _openAiApiKey;

    public OpenAIService(IHttpClientFactory httpClientFactory, IConfiguration configuration){
        _httpClientFactory = httpClientFactory;
        _openAiApiKey = configuration["OpenAI:SecretKey"];
        if (string.IsNullOrEmpty(_openAiApiKey))
        {
            Console.WriteLine("API key not found in configuration.");
        }
        else
        {
            Console.WriteLine("API key successfully loaded.");
        }
    }

    public async Task<string> ConvertToCavemanAsync(string review){
        var client = _httpClientFactory.CreateClient();

        int  estimatedTokens = (int)Math.Ceiling(review.Length / 4.0);  // Rough estimate for tokens
        int maxTokens = Math.Min(estimatedTokens, 100);  // Ensure a cap on max tokens (e.g., 100)
        Console.WriteLine("Num tokens: " + maxTokens);

        var prompt = $"Make this text sound like a caveman would speak it, and minimize two syllable words. Limit response to one sentence even if it does not reach max tokens. Eliminate repeating same phrases in response. Remove unnecessary punctuation like quotes.\"{review}";

        var openAiRequest = new {
            model = "gpt-4.1-nano",
            prompt = prompt,
            max_tokens = maxTokens
        };

        var jsonContent = JsonConvert.SerializeObject(openAiRequest);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");

        try
        {
            var response = await client.PostAsync("https://api.openai.com/v1/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to communicate with OpenAI API");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var openAiResponse = JsonConvert.DeserializeObject<OpenAiResponse>(responseContent);

            return openAiResponse?.Choices[0]?.Text.Trim() ?? "N/A";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
            throw;
        }


    }
}