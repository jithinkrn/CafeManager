using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
public class EmployeeDto
{
    public string Id { get; set; } = string.Empty;  // Employee ID in the format UIXXXXXXX, Initialize with a default value
    public string Name { get; set; } = string.Empty; // Initialize with a default value
    [JsonPropertyName("email_address")]
    public string EmailAddress { get; set; } = string.Empty; // Initialize with a default value
    [JsonPropertyName("phone_number")]
    public string PhoneNumber { get; set; } = string.Empty; //Initialize with a default value
    [JsonPropertyName("days_worked")]
    [Required]
    public int DaysWorked { get; set; }  // Calculated number of days worked
    [Required] 
    public string Gender { get; set; } = string.Empty; // Initialize with a default value
    public string? Cafe { get; set; }  // Optional, so mark as nullable
}
