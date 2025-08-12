using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class breed
{
    public int id { get; set; }

    public string? name { get; set; }

    public int? pet_type_id { get; set; }

    public virtual pet_type? pet_type { get; set; }

    public virtual ICollection<pet> pets { get; set; } = new List<pet>();
}
