using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using BCryptNet = BCrypt.Net.BCrypt;


namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được phép vào

    public class UserController : Controller
    {
        // Biến kết nối Database
        private readonly ApplicationDbContext _context;

        // Constructor để tiêm kết nối CSDL
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        //hàm thêm
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // Mã hóa mật khẩu trước khi lưu
            model.PasswordHash = BCryptNet.HashPassword(model.PasswordHash);

            // Lưu User mới vào Database
            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        //hàm sửa xóa
        // GET: Hiển thị form kèm dữ liệu cũ của User
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: Thực hiện lưu thay đổi
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(User model, string NewPassword)
        {
            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null) return NotFound();

            // 2. Xử lý mật khẩu: Nếu nhập mới thì mã hóa, nếu trống thì lấy cái cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = BCryptNet.HashPassword(NewPassword);
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            // 3. Cập nhật vào Database
            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }


        //hàm xóa
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
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