using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class pet_type
{
    public int id { get; set; }

    public string? name { get; set; }

    public virtual ICollection<breed> breeds { get; set; } = new List<breed>();

    public virtual ICollection<product> products { get; set; } = new List<product>();
}
