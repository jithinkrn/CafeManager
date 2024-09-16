using System.ComponentModel.DataAnnotations;

public class CafeDto
{
    public Guid? Id { get; set; }  // Nullable Id for requests, non-nullable in responses

    [Required]
    public string Name { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    public string Description { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    public string Location { get; set; } = string.Empty;  // Initialize with a default value

    public string? Logo { get; set; }  // Optional field

    public int? Employees { get; set; }  // Nullable, only relevant in responses
}
