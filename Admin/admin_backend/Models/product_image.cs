using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class product_image
{
    public int id { get; set; }

    public string? image_url { get; set; }

    public bool? is_primary { get; set; }

    public DateTime? uploaded_at { get; set; }

    public int? product_id { get; set; }

    public virtual product? product { get; set; }
}
