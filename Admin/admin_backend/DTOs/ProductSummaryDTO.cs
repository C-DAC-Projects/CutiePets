namespace Admin_Backend.DTOs
{
    public class ProductSummaryDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public double? Price { get; set; }
        public int? StockQuantity { get; set; }
        public bool? Available { get; set; }
        public string? PrimaryImageUrl { get; set; }
    }

}
