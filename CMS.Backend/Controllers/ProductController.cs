using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================== INDEX =====================
        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            var query = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id);

            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            if (page < 1) page = 1;
            if (page > totalPages && totalPages > 0) page = totalPages;

            var data = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = totalPages;
            ViewBag.TotalItems = totalItems;

            return View(data);
        }

        // ===================== CREATE (GET) =====================
        public IActionResult Create()
        {
            ViewBag.CategoryProductList = new SelectList(
                _context.CategoriesProducts.ToList(),
                "Id",
                "Name"
            );

            return View();
        }

        // ===================== CREATE (POST) =====================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                // Upload ảnh (nếu có)
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    var fileName = Path.GetFileName(uploadImage.FileName);
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    model.ImageUrl = "/images/" + fileName;
                }

                _context.Products.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            // reload dropdown nếu lỗi
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name");

            return View(model);
        }

        public IActionResult Edit(int id)
        {
            var product = _context.Products.FirstOrDefault(x => x.Id == id);
            if (product == null) return NotFound();

            ViewBag.CategoryProductList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name"
            );

            return View(product);
        }

        //sửa

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Product model, IFormFile uploadImage)
        {
            var product = _context.Products.FirstOrDefault(x => x.Id == model.Id);
            if (product == null) return NotFound();

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.CategoryProductId = model.CategoryProductId;

            if (uploadImage != null)
            {
                var fileName = Path.GetFileName(uploadImage.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                product.ImageUrl = "/images/" + fileName;
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product != null)
            {
                // (không bắt buộc) lưu lại Category để redirect nếu bạn muốn lọc theo category
                int categoryId = product.CategoryProductId;

                _context.Products.Remove(product);
                _context.SaveChanges();

                // quay về danh sách
                return RedirectToAction("Index");
            }

            return RedirectToAction("Index");
        }
    }
}