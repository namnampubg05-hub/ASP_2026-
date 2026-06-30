using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // 1. GET: api/categoryproducts
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoriesProducts
                .OrderByDescending(c => c.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToList();

            return Ok(categories);
        }

        // =========================
        // 2. GET: api/categoryproducts/{id}
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.CategoriesProducts
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .FirstOrDefault();

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục sản phẩm"
                });
            }

            return Ok(category);
        }

        // =========================
        // 3. POST: api/categoryproducts
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] CategoryProduct model)
        {
            if (model == null)
                return BadRequest();

            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm danh mục sản phẩm thành công",
                categoryProductId = model.Id
            });
        }

        // =========================
        // 4. PUT: api/categoryproducts/{id}
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CategoryProduct model)
        {
            var category = _context.CategoriesProducts
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục sản phẩm"
                });
            }

            category.Name = model.Name;
            category.Description = model.Description;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật danh mục sản phẩm thành công"
            });
        }

        // =========================
        // 5. DELETE: api/categoryproducts/{id}
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục sản phẩm"
                });
            }

            // Kiểm tra có sản phẩm thuộc danh mục không
            bool hasProducts = _context.Products
                .Any(p => p.CategoryProductId == id);

            if (hasProducts)
            {
                return BadRequest(new
                {
                    message = "Không thể xóa vì danh mục đang chứa sản phẩm"
                });
            }

            _context.CategoriesProducts.Remove(category);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa danh mục sản phẩm thành công"
            });
        }
    }
}