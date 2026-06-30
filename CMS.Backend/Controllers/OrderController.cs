using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

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
        public IActionResult Edit(int id, int status, string? notes)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);
            if (order == null)
                return NotFound();

            int oldStatus = order.Status;
            order.Status = status;
            if (notes != null)
                order.Notes = notes;

            const int CancelledStatus = -1;
            if (oldStatus != CancelledStatus && status == CancelledStatus)
            {
                foreach (var detail in order.OrderDetails)
                {
                    var product = _context.Products.FirstOrDefault(p => p.Id == detail.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += detail.Quantity;
                    }
                }
            }

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}
