namespace Admin_Backend.DTOs
{
    public class PetImageDTO
    {
        public int Id { get; set; }
        public string? ImageUrl { get; set; } = "";
        public bool? IsPrimary { get; set; }
        public DateTime? UploadedAt { get; set; }
    }
}
