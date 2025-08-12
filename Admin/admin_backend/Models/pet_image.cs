using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;
public partial class pet_image
{
    public int id { get; set; }

    public string? image_url { get; set; }

    public bool? is_primary { get; set; }

    public DateTime? uploaded_at { get; set; }

    public int? pet_id { get; set; }

    public virtual pet? pet { get; set; }
}
