using Microsoft.EntityFrameworkCore;
using System;

namespace CafeManager.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            var cafe1Id = Guid.NewGuid();
            var cafe2Id = Guid.NewGuid();

            modelBuilder.Entity<Cafe>().HasData(
                new Cafe
                {
                    Id = cafe1Id,
                    Name = "The Daily Grind",
                    Description = "A cozy cafe serving artisanal coffee in the heart of Tanjong Pagar.",
                    Location = "Tanjong Pagar",
                    Logo = "/uploads/sampleLogo/1_C_logo.jpg"  
                },
                new Cafe
                {
                    Id = cafe2Id,
                    Name = "Brew & Co.",
                    Description = "A modern cafe with a relaxing atmosphere, located in the bustling Orchard Road.",
                    Location = "Orchard Road",
                    Logo = "/uploads/sampleLogo/2_B_logo.jpg"  
                }
            );

            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = "UI1234567",
                    Name = "John Tan",
                    EmailAddress = "john.tan@dailygrind.com",
                    PhoneNumber = "91234567",
                    Gender = "Male",
                    CafeId = cafe1Id,  // Foreign key relationship to Cafe
                    StartDate = DateTime.Now.AddYears(-2)
                },
                new Employee
                {
                    Id = "UI2345678",
                    Name = "Jane Lim",
                    EmailAddress = "jane.lim@dailygrind.com",
                    PhoneNumber = "81234567",
                    Gender = "Female",
                    CafeId = cafe1Id,  // Foreign key relationship to Cafe
                    StartDate = DateTime.Now.AddYears(-1)
                },
                new Employee
                {
                    Id = "UI3456789",
                    Name = "Alice Wong",
                    EmailAddress = "alice.wong@brewco.com",
                    PhoneNumber = "82234567",
                    Gender = "Female",
                    CafeId = cafe2Id,  // Foreign key relationship to Cafe
                    StartDate = DateTime.Now.AddMonths(-6)
                }
            );
        }
    }
}
