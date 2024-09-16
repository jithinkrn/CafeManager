using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class CreateEmployeeDto
{
    public string? Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty; // Initialize with a default value

    [Required]
    [JsonPropertyName("email_address")]  // Map "email_address" to "EmailAddress"
    [EmailAddress]
    public string EmailAddress { get; set; } = string.Empty; // Initialize with a default value

    [Required]
    [JsonPropertyName("phone_number")]  // Map "phone_number" to "PhoneNumber"
    [RegularExpression(@"^[89]\d{7}$", ErrorMessage = "Phone number must start with 8 or 9 and be 8 digits long.")]
    public string PhoneNumber { get; set; } = string.Empty; // Initialize with a default value

    [Required]
    public string Gender { get; set; } = string.Empty; // Initialize with a default value

    [Required]
    [JsonPropertyName("start_date")]  // Map "start_date" to "StartDate"
    public DateTime StartDate { get; set; } 

    [JsonPropertyName("cafe_id")]  // Map "cafe_id" to "CafeId"
    public Guid? CafeId { get; set; }  // Allow CafeId to be nullable
}
