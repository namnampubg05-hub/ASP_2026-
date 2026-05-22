using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu thật từ SQL Server
            var data = _context.Categories.ToList();

            return View(data);
        }
    }
}