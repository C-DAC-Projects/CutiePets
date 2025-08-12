using System;
using System.Collections.Generic;

namespace Admin_Backend.Models;

public partial class user
{
    public int id { get; set; }

    public string email { get; set; } = null!;

    public string? name { get; set; }

    public string password { get; set; } = null!;

    public string? profile_image { get; set; }

    public string role { get; set; } = null!;

    public string? city { get; set; }

    public string? state { get; set; }

    public string? street { get; set; }

    public string? zip { get; set; }
}
