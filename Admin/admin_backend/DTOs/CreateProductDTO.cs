namespace Admin_Backend.DTOs
{
    public class CreateProductDTO
    {
        public string? Name { get; set; }
        public int? CategoryId { get; set; }
        public int? PetTypeId { get; set; }
        public double? Price { get; set; }
        public int? StockQuantity { get; set; }
        public string? Description { get; set; }
    }

}
