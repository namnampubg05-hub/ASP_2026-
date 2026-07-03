using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using BCryptNet = BCrypt.Net.BCrypt;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var customer = _context.Customers
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .FirstOrDefault();

            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng" });

            return Ok(customer);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateCustomerRequest request)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng" });

            if (!string.IsNullOrWhiteSpace(request.FullName))
                customer.FullName = request.FullName;

            if (!string.IsNullOrWhiteSpace(request.Phone))
                customer.Phone = request.Phone;

            if (!string.IsNullOrWhiteSpace(request.Address))
                customer.Address = request.Address;

            _context.SaveChanges();

            return Ok(new
            {
                customer.Id,
                customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            });
        }

        [HttpPut("{id}/password")]
        public IActionResult ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });

            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
                return NotFound(new { message = "Không tìm thấy khách hàng" });

            if (!VerifyPassword(request.CurrentPassword, customer.Password, p => customer.Password = p))
                return BadRequest(new { message = "Mật khẩu hiện tại không đúng" });

            customer.Password = BCryptNet.HashPassword(request.NewPassword);

            _context.SaveChanges();

            return Ok(new { message = "Đổi mật khẩu thành công" });
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

    public class UpdateCustomerRequest
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
