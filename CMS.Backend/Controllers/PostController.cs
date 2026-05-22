using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm thư viện này để dùng được hàm .Include()
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor - Tiêm DB Context vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            //Lấy dữ liệu thật từ SQL Server(kèm theo thông tin Category liên kết)
            var data = _context.Posts.Include(p => p.Category).ToList();

            return View(data);
        }
    }
}