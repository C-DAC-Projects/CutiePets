using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class pet
{
    public int id { get; set; }

    public int? age { get; set; }

    public bool? available { get; set; }

    public string? description { get; set; }

    public string? gender { get; set; }

    public string? name { get; set; }

    public double? price { get; set; }

    public DateTime? submitted_at { get; set; }

    public int? breed_id { get; set; }

    public virtual breed? breed { get; set; }

    public virtual ICollection<pet_image> pet_images { get; set; } = new List<pet_image>();
}
