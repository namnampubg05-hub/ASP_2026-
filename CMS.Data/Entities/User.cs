using System;
using System.Collections.Generic;
using System.Text;

namespace CMS.Data.Entities
{
    // Lớp User đại diện cho người dùng hệ thống (quản trị viên hoặc biên tập viên)
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}
