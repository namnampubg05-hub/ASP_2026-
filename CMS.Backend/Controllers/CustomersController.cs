using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

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

            if (customer.Password != request.CurrentPassword)
                return BadRequest(new { message = "Mật khẩu hiện tại không đúng" });

            customer.Password = request.NewPassword;

            _context.SaveChanges();

            return Ok(new { message = "Đổi mật khẩu thành công" });
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
