using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public OrderController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        private const int PageSize = 10;

        public IActionResult Index(int page = 1)
        {
            if (page < 1) page = 1;

            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate);

            var totalItems = query.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);
            if (page > totalPages && totalPages > 0) page = totalPages;

            var data = query
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.PageSize = PageSize;
            ViewBag.TotalItems = totalItems;

            return View(data);
        }

        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        public IActionResult Edit(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, int status, string? notes)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            var oldStatus = order.Status;
            UpdateOrderStatus(order, status);

            if (notes != null)
                order.Notes = notes;

            _context.SaveChanges();

            if (oldStatus != order.Status)
                await SendStatusEmailAsync(order);

            return RedirectToAction("Index", new { page = GetPage() });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Approve(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            if (order.Status != 0)
            {
                TempData["Error"] = "Chỉ có thể duyệt đơn hàng đang ở trạng thái 'Chờ xác nhận'.";
                return RedirectToAction("Index");
            }

            order.Status = 1;
            _context.SaveChanges();
            await SendStatusEmailAsync(order);
            TempData["Success"] = $"Đã duyệt đơn hàng #{id}.";
            return RedirectToAction("Index", new { page = GetPage() });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Reject(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            if (order.Status != 0)
            {
                TempData["Error"] = "Chỉ có thể từ chối đơn hàng đang ở trạng thái 'Chờ xác nhận'.";
                return RedirectToAction("Index");
            }

            RestoreStock(order);
            order.Status = 3;
            _context.SaveChanges();
            await SendStatusEmailAsync(order);
            TempData["Success"] = $"Đã từ chối đơn hàng #{id}.";
            return RedirectToAction("Index", new { page = GetPage() });
        }

        private int GetPage()
        {
            var referer = Request.Headers["Referer"].FirstOrDefault();
            if (referer != null && Uri.TryCreate(referer, UriKind.Absolute, out var uri))
            {
                var q = System.Web.HttpUtility.ParseQueryString(uri.Query);
                if (int.TryParse(q["page"], out var p) && p > 0) return p;
            }
            return 1;
        }

        private async Task SendStatusEmailAsync(Order order)
        {
            var email = order.Customer?.Email;
            if (string.IsNullOrEmpty(email)) return;

            try
            {
                await _emailService.SendOrderStatusUpdateAsync(
                    email, order.CustomerName, order.Id, order.Status, order.Notes);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Email] Lỗi gửi email cập nhật đơn #{order.Id}: {ex.Message}");
            }
        }

        private void UpdateOrderStatus(Order order, int newStatus)
        {
            int oldStatus = order.Status;
            if (oldStatus == newStatus) return;

            if (newStatus == 3)
                RestoreStock(order);
            else if (oldStatus == 3)
                DeductStock(order);

            order.Status = newStatus;
        }

        private void RestoreStock(Order order)
        {
            if (order.OrderDetails == null) return;
            foreach (var detail in order.OrderDetails)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == detail.ProductId);
                if (product != null)
                    product.StockQuantity += detail.Quantity;
            }
        }

        private void DeductStock(Order order)
        {
            if (order.OrderDetails == null) return;
            foreach (var detail in order.OrderDetails)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == detail.ProductId);
                if (product != null)
                    product.StockQuantity -= detail.Quantity;
            }
        }
    }
}
