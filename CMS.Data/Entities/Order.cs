using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    // Lớp Order đại diện cho đơn hàng của khách hàng
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerId { get; set; }

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; }

        // Thông tin giao hàng
        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        public string ShippingAddress { get; set; } = string.Empty;

        // Thông tin thanh toán
        [Required]
        public string PaymentMethod { get; set; } = "cod"; // cod, bank_transfer, momo

        public int PaymentStatus { get; set; } // 0: Chưa thanh toán, 1: Đã thanh toán

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingFee { get; set; } = 0;

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
