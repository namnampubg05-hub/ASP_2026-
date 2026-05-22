using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities; // Thay thế bằng namespace thực tế chứa thực thể User của bạn
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor để tiêm kết nối CSDL
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách thành viên
        public IActionResult Index()
        {
            // Lấy danh sách người dùng từ SQL Server
            var users = _context.Users.ToList();

            return View(users);
        }
    }
}