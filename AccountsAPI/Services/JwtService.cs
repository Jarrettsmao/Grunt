using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AccountsAPI.Models;
using Microsoft.IdentityModel.Tokens;

namespace AccountsAPI.Services;

public class JwtService {
    private readonly JwtSettings _jwtSettings;

    public JwtService(IConfiguration configuration){
        _jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
    }

    public string GenerateToken(UserInfo user){

        var claims = new List<Claim>{
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.username)
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor{
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpiryInMinutes),
            SigningCredentials = credentials,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience 
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securitytoken = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(securitytoken);
    }
}