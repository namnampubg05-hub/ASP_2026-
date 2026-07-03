using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using BCryptNet = BCrypt.Net.BCrypt;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // =========================
        // 0. FORGOT PASSWORD - REQUEST RESET TOKEN
        // =========================
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập email" });
            }

            var customer = _context.Customers.FirstOrDefault(x => x.Email == request.Email);
            if (customer == null)
            {
                return Ok(new { message = "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu" });
            }

            customer.ResetToken = Guid.NewGuid().ToString("N");
            customer.ResetTokenExpiry = DateTime.UtcNow.AddHours(24);

            _context.SaveChanges();

            try
            {
                var frontendUrl = _configuration.GetValue<string>("Frontend:Url") ?? $"{Request.Scheme}://{Request.Host}";
                var resetLink = $"{frontendUrl}/reset-password?token={customer.ResetToken}";
                await _emailService.SendPasswordResetAsync(customer.Email, customer.FullName, resetLink);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Email] Lỗi gửi email reset password: {ex.Message}");
            }

            return Ok(new { message = "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu" });
        }

        // =========================
        // 0b. RESET PASSWORD - USE TOKEN
        // =========================
        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });
            }

            var customer = _context.Customers.FirstOrDefault(x => x.ResetToken == request.Token);
            if (customer == null || customer.ResetTokenExpiry == null || customer.ResetTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Token không hợp lệ hoặc đã hết hạn" });
            }

            customer.Password = BCryptNet.HashPassword(request.NewPassword);
            customer.ResetToken = null;
            customer.ResetTokenExpiry = null;

            _context.SaveChanges();

            return Ok(new { message = "Mật khẩu đã được đặt lại thành công" });
        }

        // =========================
        // 1. REGISTER CUSTOMER
        // =========================
        [HttpPost("CustomerRegister")]
        public IActionResult CustomerRegister([FromBody] Customer model)
        {
            // check email tồn tại
            var check = _context.Customers.Any(x => x.Email == model.Email);
            if (check)
            {
                return BadRequest(new
                {
                    message = "Email đã tồn tại"
                });
            }

            var customer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = BCryptNet.HashPassword(model.Password),
                Phone = model.Phone,
                Address = model.Address
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng ký thành công",
                customerId = customer.Id
            });
        }

        // =========================
        // 2. LOGIN CUSTOMER (hỗ trợ cả password cũ plain text và đã hash)
        // =========================
        [HttpPost("CustomerLogin")]
        public IActionResult CustomerLogin([FromBody] Customer model)
        {
            var customer = _context.Customers
                .FirstOrDefault(x => x.Email == model.Email);

            if (customer == null || !VerifyPassword(model.Password, customer.Password, p => customer.Password = p))
            {
                return Unauthorized(new { message = "Sai email hoặc mật khẩu" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone
                }
            });
        }

        // =========================
        // 3. MIGRATE TOÀN BỘ MẬT KHẨU CŨ SANG BCRYPT
        // =========================
        [HttpPost("MigratePasswords")]
        public IActionResult MigratePasswords()
        {
            var updated = 0;

            foreach (var customer in _context.Customers)
            {
                if (!string.IsNullOrEmpty(customer.Password) && !customer.Password.StartsWith("$2"))
                {
                    customer.Password = BCryptNet.HashPassword(customer.Password);
                    updated++;
                }
            }

            foreach (var user in _context.Users)
            {
                if (!string.IsNullOrEmpty(user.PasswordHash) && !user.PasswordHash.StartsWith("$2"))
                {
                    user.PasswordHash = BCryptNet.HashPassword(user.PasswordHash);
                    updated++;
                }
            }

            _context.SaveChanges();

            return Ok(new { message = $"Đã mã hóa {updated} mật khẩu cũ thành công" });
        }

        private bool VerifyPassword(string input, string? stored, Action<string>? onMigrate = null)
        {
            if (string.IsNullOrEmpty(stored))
                return false;

            if (stored.StartsWith("$2"))
                return BCryptNet.Verify(input, stored);

            if (stored == input)
            {
                onMigrate?.Invoke(BCryptNet.HashPassword(input));
                _context.SaveChanges();
                return true;
            }

            return false;
        }
    }

    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}