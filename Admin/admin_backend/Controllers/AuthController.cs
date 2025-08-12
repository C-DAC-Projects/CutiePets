using Admin_Backend.Data;
using Admin_Backend.DTOs;
using Admin_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Admin_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] DTOs.LoginRequest request)
        {
            var user = _context.users.FirstOrDefault(u =>
                u.email == request.Email && u.password == request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        private string GenerateJwtToken(user user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // In-memory OTP store (for production use DB or Redis)
        private static readonly Dictionary<string, (string Otp, DateTime Expiry)> otpStore = new();

        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] EmailRequest model)
        {
            Debug.WriteLine(model.Email);

            if (string.IsNullOrWhiteSpace(model.Email) || !model.Email.Contains("@"))
                return BadRequest(new { success = false, message = "Invalid email" });

            // ✅ Check if email exists in Users table
            var user = _context.users.FirstOrDefault(u => u.email == model.Email);
            if (user == null)
                return BadRequest(new { success = false, message = "Email not registered" });

            // ✅ Generate OTP and store it in-memory
            var otp = new Random().Next(100000, 999999).ToString();
            otpStore[model.Email] = (otp, DateTime.UtcNow.AddMinutes(5));

            // TODO: Replace this with your email sending logic
            Console.WriteLine($"OTP for {model.Email}: {otp}");

            return Ok(new { success = true, message = "OTP sent successfully" });
        }


        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] OtpRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp))
                return BadRequest(new { success = false, message = "Email and OTP are required" });

            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            if (!otpStore.ContainsKey(normalizedEmail))
                return BadRequest(new { success = false, message = "No OTP found for this email" });

            var (storedOtp, expiry) = otpStore[normalizedEmail];

            if (expiry < DateTime.UtcNow)
            {
                otpStore.Remove(normalizedEmail);
                return BadRequest(new { success = false, message = "OTP expired" });
            }

            if (storedOtp != request.Otp)
                return BadRequest(new { success = false, message = "Invalid OTP" });

            // OTP is valid — remove it and return success
            otpStore.Remove(normalizedEmail);
            return Ok(new { success = true, message = "OTP verified successfully" });
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Read SMTP settings from configuration (appsettings.json)
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPortStr = _configuration["Smtp:Port"];
            var smtpUser = _configuration["Smtp:Username"];
            var smtpPass = _configuration["Smtp:Password"];
            var fromEmail = _configuration["Smtp:FromEmail"] ?? smtpUser;
            var enableSsl = bool.TryParse(_configuration["Smtp:EnableSsl"], out var sslVal) ? sslVal : true;

            if (string.IsNullOrWhiteSpace(smtpHost))
                throw new InvalidOperationException("SMTP host is not configured.");

            if (!int.TryParse(smtpPortStr, out var smtpPort))
                smtpPort = 587; // default

            using var message = new MailMessage(fromEmail, toEmail, subject, body)
            {
                IsBodyHtml = false
            };

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = enableSsl
            };

            // If you need to set other client properties (e.g., DeliveryMethod), do it here.
            await client.SendMailAsync(message);
        }
    }

    public class EmailRequest
    {
        public string Email { get; set; }
    }


    public class OtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }
}
