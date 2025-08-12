using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class product_category
{
    public int id { get; set; }

    public string? name { get; set; }

    public virtual ICollection<product> products { get; set; } = new List<product>();
}
