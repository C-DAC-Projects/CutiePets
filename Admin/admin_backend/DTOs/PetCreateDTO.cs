using Admin_Backend.DTOs;
using System.ComponentModel.DataAnnotations;

public class PetCreateDto
{
    [Required]
    public string Name { get; set; }

    [Range(0, 240, ErrorMessage = "Age must be between 0 and 240 months.")]
    public int Age { get; set; }

    [Required]
    public string Gender { get; set; }

    [Range(0, 10000000, ErrorMessage = "Price must be between 0 and 10,000,000.")]
    public double Price { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public int BreedId { get; set; }

    public List<IFormFile> Images { get; set; }
}

