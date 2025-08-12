namespace Admin_Backend.DTOs
{
    public class PetResponseDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; } = "";
        public int? Age { get; set; }
        public string? Gender { get; set; } = "";
        public string? Description { get; set; } = "";
        public double? Price { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public bool? Available { get; set; }

        public BreedDTO? Breed { get; set; } = new();
        public List<PetImageDTO>? PetImages { get; set; } = new();
    }
}
