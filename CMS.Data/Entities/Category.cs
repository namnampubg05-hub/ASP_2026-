using System;
using System.Collections.Generic;
using System.Text;
/* 
 * sinh vien: Dương Văn Nam
 * lớp : cntt k47
 * ngày tạo: 15/5/2026
 * mô tả:thực hiện quản lý danh mục
 */
namespace CMS.Data.Entities
{
    // Lớp Category đại diện cho danh mục bài viết (vd: Tin Giáo Dục, Tin Thể Thao, Tin Công Nghệ)
    public class Category
    {

        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }
}
