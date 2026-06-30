using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // LIST CATEGORY
        // =========================
        public IActionResult Index()
        {
            var data = _context.Categories.ToList();
            return View(data);
        }

        // =========================
        // CREATE - GET
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // =========================
        // CREATE - POST (SỬA)
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Category model)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // DELETE (SỬA AN TOÀN HƠN)
        // =========================
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);

            if (category != null)
            {
                // ❗ kiểm tra có sản phẩm đang dùng không
                var hasProduct = _context.Products
                    .Any(p => p.CategoryProductId == id);

                if (hasProduct)
                {
                    TempData["Error"] = "Không thể xóa vì danh mục đang có sản phẩm!";
                    return RedirectToAction("Index");
                }

                _context.Categories.Remove(category);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        // =========================
        // EDIT - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);

            if (category == null)
                return NotFound();

            return View(category);
        }

        // =========================
        // EDIT - POST (SỬA AN TOÀN HƠN)
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Category model)
        {
            var category = _context.Categories.Find(model.Id);

            if (category == null)
                return NotFound();

            category.Name = model.Name;
            category.Description = model.Description;

            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}