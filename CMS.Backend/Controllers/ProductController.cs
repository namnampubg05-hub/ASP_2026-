using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Cần thiết để sử dụng hàm .Include()
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu thật từ SQL Server kèm theo thông tin Danh mục liên kết
            var data = _context.Products.Include(p => p.CategoryProduct).ToList();

            return View(data);
        }
    }
}