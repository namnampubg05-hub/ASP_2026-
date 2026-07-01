using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var ads = _context.Advertisements
                .Where(a => a.IsActive)
                .OrderBy(a => a.SortOrder)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Accent,
                    a.Description,
                    a.BadgeText,
                    a.ImageUrl,
                    a.LinkUrl,
                    a.SortOrder
                })
                .ToList();

            return Ok(ads);
        }
    }
}
