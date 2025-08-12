using Microsoft.AspNetCore.Http;

namespace Admin_Backend.DTOs;

public class ProductFormDTO
{
    public string? Name { get; set; }

    public string? Description { get; set; }

    public double? Price { get; set; }

    public bool? Available { get; set; }

    public int? StockQuantity { get; set; }

    public int? CategoryId { get; set; }

    public int? PetTypeId { get; set; }

    public List<IFormFile>? Images { get; set; }
}
