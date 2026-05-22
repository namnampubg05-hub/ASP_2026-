using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Cần thiết để dùng hàm .Include()
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách đơn hàng từ SQL Server kèm theo thông tin Khách hàng liên kết
            var data = _context.Orders.Include(o => o.Customer).ToList();

            return View(data);
        }
    }
}