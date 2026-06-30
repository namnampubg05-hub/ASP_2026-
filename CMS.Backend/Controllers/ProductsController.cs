using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // 1. GET: api/products
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId
                })
                .ToList();

            return Ok(products);
        }

        // =========================
        // 2. GET: api/products/category/{categoryProductId}
        // =========================
        [HttpGet("category/{categoryProductId}")]
        public IActionResult GetByCategory(int categoryProductId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToList();

            return Ok(products);
        }

        // =========================
        // 3. GET: api/products/{id}
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .FirstOrDefault();

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(product);
        }

        // =========================
        // 4. GET: api/products/search?keyword=
        // =========================
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return Ok(new List<object>());

            var products = _context.Products
                .Where(p => p.Name.Contains(keyword))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToList();

            return Ok(products);
        }

        //thêm xóa sửa
        // 4. POST: api/products
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] Product model)
        {
            if (model == null)
                return BadRequest();

            _context.Products.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm sản phẩm thành công",
                productId = model.Id
            });
        }

        // =========================
        // 5. PUT: api/products/{id}
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product model)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.ImageUrl = model.ImageUrl;
            product.CategoryProductId = model.CategoryProductId;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật sản phẩm thành công"
            });
        }

        // =========================
        // 6. DELETE: api/products/{id}
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            _context.Products.Remove(product);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa sản phẩm thành công"
            });
        }
    }
}