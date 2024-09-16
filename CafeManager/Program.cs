using Microsoft.EntityFrameworkCore; // Required for DbContext and UseMySql
using Pomelo.EntityFrameworkCore.MySql; // Specifically for Pomelo MySQL

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Define CORS policy
//var corsPolicy = "AllowAllOrigins"; // You can name it anything

// Add CORS policy to services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8080", "http://localhost:3000", "http://cafemanager-frontend") // Frontend URLs
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); 
    });
});

// Add DbContext with Pomelo.EntityFrameworkCore.MySql
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 4, 2))  // Adjust the MySQL version if needed
    ));

// Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Add routing middleware
app.UseRouting();

// Apply CORS middleware
app.UseCors("AllowFrontend"); 

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
