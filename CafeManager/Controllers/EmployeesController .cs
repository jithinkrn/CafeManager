using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/employees?cafe=<cafe>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees([FromQuery] string? cafe)
    {
        IQueryable<Employee> query = _context.Employees
            .Include(e => e.Cafe);  // Include the Cafe to check the employee's affiliation

        // Filter by Cafe if provided
        if (!string.IsNullOrEmpty(cafe))
        {
            // Use a case-insensitive partial match (contains) for filtering by cafe name
            query = query.Where(e => e.Cafe != null && !string.IsNullOrEmpty(e.Cafe.Name) &&
                                     e.Cafe.Name.ToLower().Contains(cafe.ToLower().Trim()));
        }

        // Load employees into memory (client-side) to calculate DaysWorked
        var employees = await query.ToListAsync();

        // Calculate DaysWorked on the client-side and return sorted data
        var employeeResponses = employees
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                Name = e.Name,
                EmailAddress = e.EmailAddress,
                PhoneNumber = e.PhoneNumber,
                DaysWorked = (DateTime.Now - e.StartDate).Days > 0 ? (DateTime.Now - e.StartDate).Days : 0, //caluculate datys worked. 0 if the start date is in the future
                Gender = e.Gender,
                Cafe = e.Cafe != null ? e.Cafe.Name : ""  // Handle null Cafe explicitly
            })
            .OrderByDescending(e => e.DaysWorked)  // Sort by days worked
            .ToList();

        return Ok(employeeResponses);
    }


    [HttpPost]
    public async Task<ActionResult<Employee>> CreateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
    {
        // If CafeId is provided, ensure the cafe exists
        Cafe? cafe = null;
        if (createEmployeeDto.CafeId.HasValue && createEmployeeDto.CafeId != null)
        {
            cafe = await _context.Cafes.FindAsync(createEmployeeDto.CafeId);
            if (cafe == null)
            {
                return NotFound("Cafe not found.");
            }
        }

        // Generate the unique employee identifier
        string employeeId = GenerateEmployeeId();

        // Set StartDate to the current datetime (instead of coming from the frontend)
        var employee = new Employee
        {
            Id = employeeId,
            Name = createEmployeeDto.Name,
            EmailAddress = createEmployeeDto.EmailAddress,
            PhoneNumber = createEmployeeDto.PhoneNumber,
            Gender = createEmployeeDto.Gender,
            StartDate = DateTime.UtcNow,  // Set current datetime as StartDate
            CafeId = createEmployeeDto.CafeId,
            Cafe = cafe
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEmployees), new { id = employee.Id }, employee);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
    {
        var employee = await _context.Employees.Include(e => e.Cafe).FirstOrDefaultAsync(e => e.Id == createEmployeeDto.Id);
        if (employee == null)
        {
            return NotFound("Employee not found.");
        }

        Cafe? cafe = null;
        if (createEmployeeDto.CafeId.HasValue && createEmployeeDto.CafeId != null)  // Check if CafeId is provided
        {
            cafe = await _context.Cafes.FindAsync(createEmployeeDto.CafeId);
            if (cafe == null)
            {
                return NotFound("Cafe not found.");
            }
        }

        // Update the employee's details (without updating StartDate)
        employee.Name = createEmployeeDto.Name;
        employee.EmailAddress = createEmployeeDto.EmailAddress;
        employee.PhoneNumber = createEmployeeDto.PhoneNumber;
        employee.Gender = createEmployeeDto.Gender;
        employee.CafeId = createEmployeeDto.CafeId;  // This can be null
        employee.Cafe = cafe;  // This can be null if no CafeId is provided

        _context.Entry(employee).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private string GenerateEmployeeId()
    {
        const string prefix = "UI";
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        string uniqueId;

        do
        {
            uniqueId = prefix + new string(Enumerable.Repeat(chars, 7)
                .Select(s => s[random.Next(s.Length)]).ToArray());  // Generates exactly 9 characters (UIXXXXXXX)
        }
        while (_context.Employees.Any(e => e.Id == uniqueId));  // Ensure the ID is unique

        return uniqueId;
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteEmployee([FromBody] EmployeeDto employeeDto)
    {
        if (employeeDto == null || string.IsNullOrEmpty(employeeDto.Id))
        {
            return BadRequest(new { Message = "Employee Id is required." });
        }

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeDto.Id);
        if (employee == null)
        {
            return NotFound(new { Message = "Employee not found." });
        }

        _context.Employees.Remove(employee);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while deleting the employee: {ex.Message}");
        }

        return NoContent();
    }

}
