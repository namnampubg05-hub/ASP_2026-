using CMS.Data;
using CMS.Data.Entities; // Kết nối tới Entity CategoryProduct
using CMS.Data.Entities;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            //Lấy toàn bộ danh sách danh mục sản phẩm từ SQL Server
            var data = _context.CategoriesProducts.ToList();

            return View(data);
        }
    }
}