using Admin_Backend.Data;
using Admin_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Backend.DTOs;

namespace Admin_Backend.Controllers;


[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "ROLE_ADMIN")]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ProductController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // GET: api/product
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductSummaryDTO>>> GetAllProducts()
    {
        var products = await _context.products
            .Include(p => p.category)
            .Include(p => p.product_images)
            .Select(p => new ProductSummaryDTO
            {
                Id = p.id,
                Name = p.name,
                Category = p.category != null ? p.category.name : null,
                Price = p.price,
                StockQuantity = p.stock_quantity,
                Available = p.available,
                PrimaryImageUrl = p.product_images
                    .Where(img => img.is_primary == true)
                    .Select(img => img.image_url)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(products);
    }

    //Get product by id
    [HttpGet("{id}")]
    public async Task<ActionResult<product>> GetProductById(int id)
    {
        var prod = await _context.products
            .Include(p => p.category)
            .Include(p => p.pet_type)               // Include pet_type
            .Include(p => p.product_images)
            .FirstOrDefaultAsync(p => p.id == id);

        if (prod == null)
        {
            return NotFound();
        }

        return prod;
    }


    // POST: api/product
    [HttpPost]
    [RequestSizeLimit(10_000_000)] // Optional: limit size to 10MB
    public async Task<IActionResult> CreateProduct(
     [FromForm] CreateProductDTO dto,
     [FromForm] List<IFormFile> images)
    {
        var product = new product
        {
            name = dto.Name,
            category_id = dto.CategoryId,
            pet_type_id = dto.PetTypeId,
            price = dto.Price,
            stock_quantity = dto.StockQuantity,
            available = dto.StockQuantity > 0, // AUTO SET
            description = dto.Description
        };

        _context.products.Add(product);
        await _context.SaveChangesAsync();

        var productId = product.id;

        if (images != null && images.Count > 0)
        {
            string uploadsFolder = Path.Combine("wwwroot", "uploads", "products", productId.ToString());
            Directory.CreateDirectory(uploadsFolder);

            for (int i = 0; i < images.Count; i++)
            {
                var image = images[i];
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var relativePath = Path.Combine("uploads", "products", productId.ToString(), fileName).Replace("\\", "/");

                var productImage = new product_image
                {
                    product_id = productId,
                    image_url = relativePath,
                    is_primary = (i == 0), // first image as primary
                    uploaded_at = DateTime.Now
                };

                _context.product_images.Add(productImage);
            }

            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Product created successfully", productId });
    }


    // PUT: api/product/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductFormDTO form)
    {
        var product = await _context.products
            .Include(p => p.product_images)
            .FirstOrDefaultAsync(p => p.id == id);

        if (product == null)
            return NotFound();

        product.name = form.Name;
        product.description = form.Description;
        product.price = form.Price;
        product.stock_quantity = form.StockQuantity;
        product.available = form.StockQuantity > 0; // AUTO SET
        product.category_id = form.CategoryId;
        product.pet_type_id = form.PetTypeId;

        bool hasPrimaryImage = product.product_images.Any(img => (bool)img.is_primary);

        if (form.Images != null && form.Images.Count > 0)
        {
            string uploadsFolder = Path.Combine("wwwroot", "uploads", "products", product.id.ToString());
            Directory.CreateDirectory(uploadsFolder);

            for (int i = 0; i < form.Images.Count; i++)
            {
                var image = form.Images[i];
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var relativePath = Path.Combine("uploads", "products", product.id.ToString(), fileName).Replace("\\", "/");

                var productImage = new product_image
                {
                    product_id = product.id,
                    image_url = relativePath,
                    uploaded_at = DateTime.Now,
                    is_primary = (!hasPrimaryImage && i == 0)
                };

                _context.product_images.Add(productImage);
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }



    // DELETE: api/product/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.products
            .Include(p => p.product_images)
            .FirstOrDefaultAsync(p => p.id == id);

        if (product == null)
        {
            return NotFound();
        }

        foreach (var image in product.product_images)
        {
            var path = Path.Combine(_environment.WebRootPath, "uploads", image.image_url);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }

        _context.products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ------------------ CATEGORY RELATED ------------------

    // GET: api/product/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<product_category>>> GetAllCategories()
    {
        return await _context.product_categories.ToListAsync();
    }

    // POST: api/product/categories
    [HttpPost("categories")]
    public async Task<ActionResult<product_category>> CreateCategory([FromBody] product_category category)
    {
        _context.product_categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    // DELETE: api/product/categories/5
    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.product_categories.FindAsync(id);
        if (category == null)
        {
            return NotFound();
        }

        _context.product_categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ------------------ HELPER METHODS ------------------

    private async Task<string> SaveImage(IFormFile image)
    {
        var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads");
        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        return fileName;
    }



    // ------------------ DELETING IMAGE ------------------

    [HttpDelete("image/{imageId}")]
    public async Task<IActionResult> DeleteProductImage(int imageId)
    {
        var image = await _context.product_images.FirstOrDefaultAsync(i => i.id == imageId);

        if (image == null)
        {
            return NotFound(new { message = "Image not found" });
        }

        // Build the physical path
        var fullPath = Path.Combine("wwwroot", image.image_url.Replace("/", Path.DirectorySeparatorChar.ToString()));

        // Delete the image file from the file system
        if (System.IO.File.Exists(fullPath))
        {
            try
            {
                System.IO.File.Delete(fullPath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting image file", details = ex.Message });
            }
        }

        // Delete the image record from the database
        _context.product_images.Remove(image);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Image deleted successfully" });
    }



    //DELETE /api/product/12/image/43
    [HttpDelete("{productId}/image/{imageId}")]
    public async Task<IActionResult> DeleteProductImage(int productId, int imageId)
    {
        var image = await _context.product_images
            .FirstOrDefaultAsync(i => i.id == imageId && i.product_id == productId);

        if (image == null)
        {
            return NotFound(new { message = "Image not found for this product" });
        }

        // Store whether this was the primary image
        bool? wasPrimary = image.is_primary;

        // Delete the file from filesystem
        var fullPath = Path.Combine("wwwroot", image.image_url.Replace("/", Path.DirectorySeparatorChar.ToString()));
        if (System.IO.File.Exists(fullPath))
        {
            try
            {
                System.IO.File.Delete(fullPath);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting image file", details = ex.Message });
            }
        }

        // Remove image from database
        _context.product_images.Remove(image);
        await _context.SaveChangesAsync();

        // Reassign another image as primary if needed
        if ((bool)wasPrimary)
        {
            var anotherImage = await _context.product_images
                .Where(i => i.product_id == productId)
                .OrderBy(i => i.uploaded_at)
                .FirstOrDefaultAsync();

            if (anotherImage != null)
            {
                anotherImage.is_primary = true;
                _context.product_images.Update(anotherImage);
                await _context.SaveChangesAsync();
            }
        }

        return Ok(new { message = "Product image deleted successfully" });
    }


}
