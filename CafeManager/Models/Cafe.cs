using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Cafe
{
    [Key]
    [Required]
    public Guid Id { get; set; }  // Unique identifier

    [Required]
    public string Name { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    public string Description { get; set; } = string.Empty;  // Initialize with a default value

    public string? Logo { get; set; }  //Optional field, Nullable to avoid warning on application start

    [Required]
    public string Location { get; set; } = string.Empty;  // Initialize with a default value

    public ICollection<Employee> Employees { get; set; } = new List<Employee>();  // Navigation property for employees, Initialised with empty list  
}
