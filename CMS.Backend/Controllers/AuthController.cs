using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
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
                Password = model.Password, // lưu thô theo yêu cầu
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
        // 2. LOGIN CUSTOMER
        // =========================
        [HttpPost("CustomerLogin")]
        public IActionResult CustomerLogin([FromBody] Customer model)
        {
            var customer = _context.Customers
                .FirstOrDefault(x =>
                    x.Email == model.Email &&
                    x.Password == model.Password
                );

            if (customer == null)
            {
                return Unauthorized(new
                {
                    message = "Sai email hoặc mật khẩu"
                });
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
    }
}