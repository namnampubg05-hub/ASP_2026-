using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Cần thiết để sử dụng hàm .Include()
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor kết nối CSDL
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy toàn bộ dữ liệu kèm thông tin của bảng Order và Product liên kết
            var data = _context.OrderDetails
                               .Include(od => od.Order)
                               .Include(od => od.Product)
                               .ToList();

            return View(data);
        }
    }
}