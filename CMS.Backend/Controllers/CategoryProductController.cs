using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // LIST CATEGORY PRODUCT
        // =========================
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
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
        // CREATE - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // EDIT - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
                return NotFound();

            return View(category);
        }

        // =========================
        // EDIT - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(CategoryProduct model)
        {
            var category = _context.CategoriesProducts.Find(model.Id);

            if (category == null)
                return NotFound();

            category.Name = model.Name;
            category.Description = model.Description;

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // DELETE
        // =========================
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category != null)
            {
                // Kiểm tra xem danh mục có sản phẩm hay không
                bool hasProducts = _context.Products
                    .Any(p => p.CategoryProductId == id);

                if (hasProducts)
                {
                    TempData["Error"] =
                        "Không thể xóa vì danh mục đang chứa sản phẩm!";

                    return RedirectToAction("Index");
                }

                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}