using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    // Khách hàng
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        [Required]
        public string Password { get; set; } // Lưu mật khẩu đã mã hóa BCrypt

        public string? ResetToken { get; set; }

        public DateTime? ResetTokenExpiry { get; set; }

        public virtual ICollection<Order>? Orders { get; set; }
    }
}


