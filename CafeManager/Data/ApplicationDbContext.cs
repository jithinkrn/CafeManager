using CafeManager.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class ApplicationDbContext : DbContext
{
    private readonly IConfiguration _configuration;
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define the one-to-many relationship between Cafe and Employees
        modelBuilder.Entity<Cafe>()
            .HasMany(c => c.Employees) // A Cafe has many Employees
            .WithOne(e => e.Cafe) // An Employee has one Cafe
            .HasForeignKey(e => e.CafeId); // Foreign key is CafeId

        // Ensure unique constraint that one employee can't work at two cafes
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Id)
            .IsUnique();

        // Call the Seed method to seed initial data. for devlopment only
        //modelBuilder.Seed();
    }


    public DbSet<Cafe> Cafes { get; set; }
    public DbSet<Employee> Employees { get; set; }
}
