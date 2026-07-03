using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;
using BCryptNet = BCrypt.Net.BCrypt;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(string username, string password)
    {
        // 1. Kiểm tra tài khoản trong Database
        var user = _context.Users.FirstOrDefault(u => u.Username == username);

        if (user == null || !VerifyPassword(password, user.PasswordHash, p => user.PasswordHash = p))
        {
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            return View();
        }

        // 2. Thiết lập danh tính (Claims)
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role), // Lưu vai trò: Admin/Editor
            new Claim("FullName", user.FullName)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

        // 3. Đăng nhập và lưu Cookie vào trình duyệt
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity));

        return RedirectToAction("Index", "Home");
    }
    //hàm chặn
    [HttpGet]
    public IActionResult AccessDenied()
    {
        return View();
    }


    private bool VerifyPassword(string input, string? stored, Action<string>? onMigrate = null)
    {
        if (string.IsNullOrEmpty(stored))
            return false;

        if (stored.StartsWith("$2"))
            return BCryptNet.Verify(input, stored);

        if (stored == input)
        {
            onMigrate?.Invoke(BCryptNet.HashPassword(input));
            _context.SaveChanges();
            return true;
        }

        return false;
    }

    // Hàm đăng xuất
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Login");
    }


}
