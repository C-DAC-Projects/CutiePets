using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class product
{
    public int id { get; set; }

    public bool? available { get; set; }

    public string? description { get; set; }

    public string? name { get; set; }

    public double? price { get; set; }

    public int? stock_quantity { get; set; }

    public int? category_id { get; set; }

    public int? pet_type_id { get; set; }

    public virtual product_category? category { get; set; }

    public virtual pet_type? pet_type { get; set; }

    public virtual ICollection<product_image> product_images { get; set; } = new List<product_image>();
}
