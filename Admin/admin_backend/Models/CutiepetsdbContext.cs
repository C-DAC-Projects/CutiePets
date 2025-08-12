using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Admin_Backend.Models;

public partial class CutiepetsdbContext : DbContext
{
    public CutiepetsdbContext()
    {
    }

    public CutiepetsdbContext(DbContextOptions<CutiepetsdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<user> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=cutiepetsdb;user=root;password=manager", Microsoft.EntityFrameworkCore.ServerVersion.Parse("9.2.0-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<user>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.email, "UK6dotkott2kjsp8vw4d0m25fb7").IsUnique();

            entity.Property(e => e.city).HasMaxLength(255);
            entity.Property(e => e.name).HasMaxLength(255);
            entity.Property(e => e.password).HasMaxLength(255);
            entity.Property(e => e.profile_image).HasMaxLength(255);
            entity.Property(e => e.role)
                .HasMaxLength(20)
                .HasDefaultValueSql("'ROLE_USER'");
            entity.Property(e => e.state).HasMaxLength(255);
            entity.Property(e => e.street).HasMaxLength(255);
            entity.Property(e => e.zip).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
