using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Employee
{
    [Key]
    [Required]
    [StringLength(9, ErrorMessage = "ID must be in format UIXXXXXXX.")]
    public string Id { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    public string Name { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    [EmailAddress]
    public string EmailAddress { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    [RegularExpression(@"^[89]\d{7}$", ErrorMessage = "Phone number must start with 8 or 9 and be 8 digits long.")]
    public string PhoneNumber { get; set; } = string.Empty;  // Initialize with a default value

    [Required]
    public string Gender { get; set; } = string.Empty;  // Initialize with a default value

    // Foreign key to Cafe
    public Guid? CafeId { get; set; }  // Make CafeId nullable since cafe is optional
    [ForeignKey("CafeId")]
    [JsonIgnore] //to avoid serialization issues with the Cafe navigation property
    public Cafe? Cafe { get; set; }  // Navigation property. Nullable to avoid warning on application start

    [Required]
    public DateTime StartDate { get; set; }
}
