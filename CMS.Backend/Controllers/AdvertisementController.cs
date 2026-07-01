using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class AdvertisementController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var data = _context.Advertisements
                .OrderBy(a => a.SortOrder)
                .ToList();
            return View(data);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Advertisement model)
        {
            if (ModelState.IsValid)
            {
                model.CreatedDate = DateTime.Now;
                _context.Advertisements.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var ad = _context.Advertisements.Find(id);
            if (ad == null) return NotFound();
            return View(ad);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Advertisement model)
        {
            var ad = _context.Advertisements.Find(model.Id);
            if (ad == null) return NotFound();

            ad.Title = model.Title;
            ad.Accent = model.Accent;
            ad.Description = model.Description;
            ad.BadgeText = model.BadgeText;
            ad.ImageUrl = model.ImageUrl;
            ad.LinkUrl = model.LinkUrl;
            ad.SortOrder = model.SortOrder;
            ad.IsActive = model.IsActive;

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var ad = _context.Advertisements.Find(id);
            if (ad != null)
            {
                _context.Advertisements.Remove(ad);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
