using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // 1. GET: api/categories
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.Categories
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
        // 2. GET: api/categories/{id}
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.Categories
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
                    message = "Không tìm thấy danh mục"
                });
            }

            return Ok(category);
        }

        // =========================
        // 3. POST: api/categories
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] Category model)
        {
            if (model == null)
                return BadRequest();

            _context.Categories.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm danh mục thành công",
                categoryId = model.Id
            });
        }

        // =========================
        // 4. PUT: api/categories/{id}
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Category model)
        {
            var category = _context.Categories
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            category.Name = model.Name;
            category.Description = model.Description;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật danh mục thành công"
            });
        }

        // =========================
        // 5. DELETE: api/categories/{id}
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            // Kiểm tra có bài viết thuộc danh mục không
            bool hasPosts = _context.Posts.Any(p => p.CategoryId == id);

            if (hasPosts)
            {
                return BadRequest(new
                {
                    message = "Không thể xóa vì danh mục đang có bài viết"
                });
            }

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa danh mục thành công"
            });
        }
    }
}