using System;
using System.Collections.Generic;
using System.Text;
/* 
 * sinh vien: Dương Văn Nam
 * lớp : cntt k47
 * ngày tạo: 15/5/2026
 * mô tả:thực hiện quản lý danh mục
 */
using System.ComponentModel.DataAnnotations;
namespace CMS.Data.Entities
{
    // Lớp CategoryProduct đại diện cho danh mục sản phẩm (vd: Điện thoại, Laptop, Phụ kiện)
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}
