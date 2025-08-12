using Admin_Backend.Data;
using Admin_Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Backend.DTOs;

namespace Admin_Backend.Controllers;


[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "ROLE_ADMIN")]
public class PetController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PetController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/pet
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PetResponseDTO>>> GetAllPets()
    {
        var pets = await _context.pets
            .Include(p => p.breed)
                .ThenInclude(b => b.pet_type)
            .Include(p => p.pet_images)
            .ToListAsync();

        var result = pets.Select(p => new PetResponseDTO
        {
            Id = p.id,
            Name = p.name,
            Age = p.age,
            Gender = p.gender,
            Description = p.description,
            Price = p.price,
            SubmittedAt = p.submitted_at,
            Available = p.available,
            Breed = new BreedDTO
            {
                Id = p.breed.id,
                Name = p.breed.name,
                PetType = new PetTypeDTO
                {
                    Id = p.breed.pet_type.id,
                    Name = p.breed.pet_type.name
                }
            },
            PetImages = p.pet_images.Select(img => new PetImageDTO
            {
                Id = img.id,
                ImageUrl = img.image_url,
                IsPrimary = img.is_primary,
                UploadedAt = img.uploaded_at
            }).ToList()
        }).ToList();

        return Ok(result);
    }


    // GET: api/pet/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PetResponseDTO>> GetPetById(int id)
    {
        var p = await _context.pets
            .Include(p => p.breed)
                .ThenInclude(b => b.pet_type)
            .Include(p => p.pet_images)
            .FirstOrDefaultAsync(p => p.id == id);

        if (p == null)
            return NotFound();

        var dto = new PetResponseDTO
        {
            Id = p.id,
            Name = p.name,
            Age = p.age,
            Gender = p.gender,
            Description = p.description,
            Price = p.price,
            SubmittedAt = p.submitted_at,
            Available = p.available,
            Breed = new BreedDTO
            {
                Id = p.breed.id,
                Name = p.breed.name,
                PetType = new PetTypeDTO
                {
                    Id = p.breed.pet_type.id,
                    Name = p.breed.pet_type.name
                }
            },
            PetImages = p.pet_images.Select(img => new PetImageDTO
            {
                Id = img.id,
                ImageUrl = img.image_url,
                IsPrimary = img.is_primary,
                UploadedAt = img.uploaded_at
            }).ToList()
        };

        return Ok(dto);
    }



    // POST: api/pet
    [HttpPost]
    public async Task<IActionResult> CreatePet([FromForm] PetCreateDto petDto)
    {
        var pet = new pet
        {
            name = petDto.Name,
            age = petDto.Age,
            gender = petDto.Gender,
            price = petDto.Price,
            description = petDto.Description,
            breed_id = petDto.BreedId,
            available = true,
            submitted_at = DateTime.Now
        };

        _context.pets.Add(pet);
        await _context.SaveChangesAsync(); // pet.id generated here

        if (petDto.Images != null && petDto.Images.Count > 0)
        {
            var uploadsFolder = Path.Combine("wwwroot", "uploads", "pets", pet.id.ToString());
            Directory.CreateDirectory(uploadsFolder);

            for (int i = 0; i < petDto.Images.Count; i++)
            {
                var file = petDto.Images[i];
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativePath = Path.Combine("uploads", "pets", pet.id.ToString(), fileName).Replace("\\", "/");

                var petImage = new pet_image
                {
                    image_url = relativePath,
                    is_primary = (i == 0),
                    uploaded_at = DateTime.Now,
                    pet_id = pet.id
                };

                _context.pet_images.Add(petImage);
            }

            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetPetById), new { id = pet.id }, pet);
    }








    // PUT: api/pet/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePet(int id, [FromForm] PetCreateDto petDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var pet = await _context.pets.Include(p => p.pet_images).FirstOrDefaultAsync(p => p.id == id);
        if (pet == null)
            return NotFound();

        pet.name = petDto.Name;
        pet.age = petDto.Age;
        pet.gender = petDto.Gender;
        pet.price = petDto.Price;
        pet.description = petDto.Description;
        pet.breed_id = petDto.BreedId;

        if (petDto.Images != null && petDto.Images.Count > 0)
        {
            var uploadsFolder = Path.Combine("wwwroot", "uploads", "pets", pet.id.ToString());
            Directory.CreateDirectory(uploadsFolder);

            foreach (var file in petDto.Images.Select((value, index) => new { value, index }))
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.value.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.value.CopyToAsync(stream);
                }

                var relativePath = Path.Combine("uploads", "pets", pet.id.ToString(), fileName).Replace("\\", "/");

                var petImage = new pet_image
                {
                    image_url = relativePath,
                    is_primary = (file.index == 0),
                    uploaded_at = DateTime.Now,
                    pet_id = pet.id
                };

                _context.pet_images.Add(petImage);
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }








    // DELETE: api/pet/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePet(int id)
    {
        var pet = await _context.pets
            .Include(p => p.pet_images) // Include related images
            .FirstOrDefaultAsync(p => p.id == id);

        if (pet == null)
            return NotFound();

        // Remove physical image files from wwwroot/uploads/pets
        foreach (var image in pet.pet_images)
        {
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.image_url.TrimStart('/'));
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }

        // Remove images from database
        _context.pet_images.RemoveRange(pet.pet_images);

        // Remove pet
        _context.pets.Remove(pet);

        await _context.SaveChangesAsync();

        return NoContent();
    }





    // DELETE: api/pet/{petId}/images/{imageId}
    [HttpDelete("{petId}/images/{imageId}")]
    public async Task<IActionResult> DeletePetImage(int petId, int imageId)
    {
        var image = await _context.pet_images
            .FirstOrDefaultAsync(pi => pi.id == imageId && pi.pet_id == petId);

        if (image == null)
        {
            return NotFound(new { message = "Pet image not found." });
        }

        // Delete file from filesystem
        var filePath = Path.Combine("wwwroot", image.image_url.Replace("/", Path.DirectorySeparatorChar.ToString()));
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        bool wasPrimary = (bool)image.is_primary;

        // Remove from DB
        _context.pet_images.Remove(image);
        await _context.SaveChangesAsync();

        // If it was primary, reassign another image as primary
        if (wasPrimary)
        {
            var anotherImage = await _context.pet_images
                .Where(pi => pi.pet_id == petId)
                .OrderBy(pi => pi.uploaded_at)
                .FirstOrDefaultAsync();

            if (anotherImage != null)
            {
                anotherImage.is_primary = true;
                await _context.SaveChangesAsync();
            }
        }

        return Ok(new { message = "Pet image deleted successfully." });
    }


}

