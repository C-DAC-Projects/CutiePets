namespace Admin_Backend.DTOs
{

    public class BreedDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; } = "";
        public PetTypeDTO? PetType { get; set; } = new();
    }
}
