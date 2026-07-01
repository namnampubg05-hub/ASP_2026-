using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Advertisement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        public string? Accent { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(200)]
        public string? BadgeText { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        public string? LinkUrl { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
