using System;
using System.Collections.Generic;
using Admin_Backend.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Admin_Backend.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<breed> breeds { get; set; }

    public virtual DbSet<pet> pets { get; set; }

    public virtual DbSet<pet_image> pet_images { get; set; }

    public virtual DbSet<pet_type> pet_types { get; set; }

    public virtual DbSet<product> products { get; set; }

    public virtual DbSet<product_category> product_categories { get; set; }

    public virtual DbSet<product_image> product_images { get; set; }

    public virtual DbSet<user> users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=cutiepetsdb;user=root;password=manager", Microsoft.EntityFrameworkCore.ServerVersion.Parse("9.2.0-mysql"));


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<breed>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.pet_type_id, "FKfm2ur16u4v62csva1tphmtnbh");

            entity.Property(e => e.name).HasMaxLength(255);

            entity.HasOne(d => d.pet_type).WithMany(p => p.breeds)
                .HasForeignKey(d => d.pet_type_id)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FKfm2ur16u4v62csva1tphmtnbh");
        });

        modelBuilder.Entity<pet>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.breed_id, "FKr2wnqcmtrr16oaipocajcdn7w");

            entity.Property(e => e.available).HasColumnType("bit(1)");
            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.gender).HasMaxLength(255);
            entity.Property(e => e.name).HasMaxLength(255);
            entity.Property(e => e.submitted_at).HasMaxLength(6);

            entity.HasOne(d => d.breed).WithMany(p => p.pets)
                .HasForeignKey(d => d.breed_id)
                .HasConstraintName("FKr2wnqcmtrr16oaipocajcdn7w");
        });

        modelBuilder.Entity<pet_image>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.pet_id, "FKauwhaty3q9lfuoyy6018bs17n");

            entity.Property(e => e.image_url).HasMaxLength(255);
            entity.Property(e => e.is_primary).HasColumnType("bit(1)");
            entity.Property(e => e.uploaded_at).HasMaxLength(6);

            entity.HasOne(d => d.pet).WithMany(p => p.pet_images)
                .HasForeignKey(d => d.pet_id)
                .HasConstraintName("FKauwhaty3q9lfuoyy6018bs17n");
        });

        modelBuilder.Entity<pet_type>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.Property(e => e.name).HasMaxLength(255);
        });

        modelBuilder.Entity<product>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.category_id, "FK6t5dtw6tyo83ywljwohuc6g7k");

            entity.HasIndex(e => e.pet_type_id, "FKifim4ev03kpvily1m6k2eib9p");

            entity.Property(e => e.available).HasColumnType("bit(1)");
            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.name).HasMaxLength(255);

            entity.HasOne(d => d.category).WithMany(p => p.products)
                .HasForeignKey(d => d.category_id)
                .HasConstraintName("FK6t5dtw6tyo83ywljwohuc6g7k");

            entity.HasOne(d => d.pet_type).WithMany(p => p.products)
                .HasForeignKey(d => d.pet_type_id)
                .HasConstraintName("FKifim4ev03kpvily1m6k2eib9p");
        });

        modelBuilder.Entity<product_category>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.Property(e => e.name).HasMaxLength(255);
        });

        modelBuilder.Entity<product_image>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.product_id, "FKqnq71xsohugpqwf3c9gxmsuy");

            entity.Property(e => e.image_url).HasMaxLength(255);
            entity.Property(e => e.is_primary).HasColumnType("bit(1)");
            entity.Property(e => e.uploaded_at).HasMaxLength(6);

            entity.HasOne(d => d.product).WithMany(p => p.product_images)
                .HasForeignKey(d => d.product_id)
                .HasConstraintName("FKqnq71xsohugpqwf3c9gxmsuy");
        });

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

