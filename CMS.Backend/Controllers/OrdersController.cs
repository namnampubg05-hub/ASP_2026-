using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        public List<CreateOrderItemRequest> Items { get; set; } = new();
        public string CustomerName { get; set; } = "";
        public string CustomerPhone { get; set; } = "";
        public string ShippingAddress { get; set; } = "";
        public string PaymentMethod { get; set; } = "cod";
        public string Notes { get; set; } = "";
    }

    public class CreateOrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // 1. CREATE ORDER
        // =========================
        [HttpPost]
        public IActionResult CreateOrder([FromBody] CreateOrderRequest request)
        {
            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                ShippingAddress = request.ShippingAddress,
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = request.PaymentMethod == "cod" ? 0 : 0,
                Notes = request.Notes,
                ShippingFee = 0
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            foreach (var item in request.Items)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);
                if (product == null) continue;

                if (product.StockQuantity < item.Quantity)
                {
                    return BadRequest($"Sản phẩm {product.Name} không đủ hàng");
                }

                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };

                product.StockQuantity -= item.Quantity;

                _context.OrderDetails.Add(detail);
            }

            _context.SaveChanges();

            return Ok(new
            {
                message = "Đặt hàng thành công",
                orderId = order.Id
            });
        }
        // =========================
        // 2. LỊCH SỬ ĐƠN HÀNG
        // =========================
        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var orders = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.CustomerName,
                    o.CustomerPhone,
                    o.ShippingAddress,
                    o.PaymentMethod,
                    o.PaymentStatus,
                    o.Notes,
                    o.ShippingFee,
                    Items = o.OrderDetails.Select(x => new
                    {
                        x.ProductId,
                        ProductName = x.Product.Name,
                        ImageUrl = x.Product.ImageUrl,
                        x.Quantity,
                        x.UnitPrice
                    })
                })
                .ToList();

            return Ok(orders);
        }
    }
}