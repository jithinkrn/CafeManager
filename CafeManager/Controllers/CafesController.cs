using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class CafesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CafesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/cafes?location=<location>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CafeDto>>> GetCafes([FromQuery] string? location)
    {
        IQueryable<Cafe> query = _context.Cafes.Include(c => c.Employees);

        // If a location is provided, filter by partial match (case-insensitive)
        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(c => c.Location.ToLower().Contains(location.ToLower().Trim()));
        }

        // Prepare the list of cafes to return
        var cafes = await query
            .Select(c => new CafeDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Location = c.Location,
                Employees = c.Employees.Count,
                Logo = string.IsNullOrEmpty(c.Logo) ? null : $"{Request.Scheme}://{Request.Host}{c.Logo}"
            })
            .OrderByDescending(c => c.Employees)  // Order by highest number of employees first
            .ToListAsync();

        return Ok(cafes);
    }

    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10MB size limit for the request
    public async Task<ActionResult<CafeDto>> CreateCafe([FromForm] CafeDto cafeRequest, IFormFile? logo)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Handle file upload
        string? logoPath = null;
        if (logo != null && logo.Length > 0)
        {
            var fileExtension = Path.GetExtension(logo.FileName);

            // Check if the file extension is null or empty
            if (!string.IsNullOrEmpty(fileExtension))
            {
                var uploadsFolder = Path.Combine("wwwroot", "uploads", "logos");
                Directory.CreateDirectory(uploadsFolder);
                var fileName = Guid.NewGuid() + fileExtension;
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await logo.CopyToAsync(fileStream);
                }

                logoPath = $"/uploads/logos/{fileName}";
            }
            else
            {
                // If the file extension is null or empty, set logoPath to null
                logoPath = null;
            }
        }

        var newCafe = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = cafeRequest.Name,
            Description = cafeRequest.Description,
            Location = cafeRequest.Location,
            Logo = logoPath  // Save the path of the logo or null
        };

        _context.Cafes.Add(newCafe);
        await _context.SaveChangesAsync();

        var cafeResponse = new CafeDto
        {
            Id = newCafe.Id,
            Name = newCafe.Name,
            Description = newCafe.Description,
            Location = newCafe.Location,
            Employees = 0,
            Logo = string.IsNullOrEmpty(newCafe.Logo) ? null : $"{Request.Scheme}://{Request.Host}{newCafe.Logo}"
        };

        return CreatedAtAction(nameof(GetCafes), new { id = newCafe.Id }, cafeResponse);
    }


    [HttpPut]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10MB size limit for the request
    public async Task<IActionResult> UpdateCafe([FromForm] CafeDto cafeRequest, IFormFile? logo)
    {
        if (cafeRequest.Id == Guid.Empty)
        {
            return BadRequest(new { Message = "Cafe ID is required for updating." });
        }

        var cafe = await _context.Cafes.FindAsync(cafeRequest.Id);
        if (cafe == null)
        {
            return NotFound(new { Message = "Cafe not found" });
        }

        // Handle file upload if provided
        if (logo != null && logo.Length > 0)
        {
            var fileExtension = Path.GetExtension(logo.FileName);

            // Check if the file extension is null or empty
            if (string.IsNullOrEmpty(fileExtension))
            {
                // Set cafe logo to null if file extension is not valid
                cafe.Logo = null;
            }
            else
            {
                var uploadsFolder = Path.Combine("wwwroot", "uploads", "logos");
                Directory.CreateDirectory(uploadsFolder);
                var fileName = Guid.NewGuid() + fileExtension;
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await logo.CopyToAsync(fileStream);
                }

                // Delete the old logo if needed
                if (!string.IsNullOrEmpty(cafe.Logo))
                {
                    var oldFilePath = Path.Combine("wwwroot", cafe.Logo.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Update cafe logo
                cafe.Logo = $"/uploads/logos/{fileName}";
            }
        }

        // Update other cafe details
        cafe.Name = cafeRequest.Name;
        cafe.Description = cafeRequest.Description;
        cafe.Location = cafeRequest.Location;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "An error occurred while updating the cafe details.");
        }

        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteCafe([FromBody] CafeDto cafeDto)
    {
        if (cafeDto == null || !cafeDto.Id.HasValue)
        {
            return BadRequest(new { Message = "Cafe Id is required." });
        }

        var cafe = await _context.Cafes.Include(c => c.Employees).FirstOrDefaultAsync(c => c.Id == cafeDto.Id.Value);
        if (cafe == null)
        {
            return NotFound(new { Message = "Cafe not found." });
        }

        _context.Employees.RemoveRange(cafe.Employees);
        _context.Cafes.Remove(cafe);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while deleting the cafe and its employees: {ex.Message}");
        }

        return NoContent();
    }

}
