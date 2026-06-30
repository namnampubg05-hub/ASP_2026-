using Microsoft.AspNetCore.Mvc;
using CMS.Data; // Thay bằng Namespace của project chứa ApplicationDbContext của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên "Posts"
    // Khi chạy, địa chỉ sẽ là: https://localhost:xxxx/api/posts
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để hệ thống hỗ trợ các tính năng RESTful
    [ApiController]

    // 3. API Controller phải kế thừa từ ControllerBase (thay vì Controller như MVC)
    public class PostsController : ControllerBase
    {

        // 1. Chỉ định đây là phương thức GET (Dùng để lấy dữ liệu)
        [HttpGet]
        public IActionResult GetAll()
        {
            // Lấy dữ liệu từ bảng Posts
            var posts = _context.Posts
                .OrderByDescending(p => p.Id) // Sắp xếp bài mới nhất lên đầu
                .Select(p => new {            // "Gọt tỉa" dữ liệu: chỉ lấy những trường cần thiết
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name // Lấy tên danh mục thay vì chỉ lấy ID
                })
                .ToList();

            // Trả về kết quả cho Frontend kèm mã trạng thái 200 (Thành công)
            return Ok(posts);
        }

        // 2. Định nghĩa đường dẫn có tham số: api/posts/category/{id}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ URL
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }

        // 3. GET: api/posts/{id} - Lấy chi tiết 1 bài viết
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var post = _context.Posts
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefault();

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết" });
            }

            return Ok(post);
        }




        // 4. Khai báo biến kết nối Database
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo (Constructor): "Tiêm" kết nối Database vào để sử dụng
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }


    }
}
