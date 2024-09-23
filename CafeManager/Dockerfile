# Use the official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET SDK for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the .csproj file and restore dependencies
COPY ["CafeManager.csproj", "./"]
RUN dotnet restore

# Copy the remaining source code and build the application
COPY . . 
WORKDIR "/src/"
RUN dotnet build -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Use the base runtime image to run the application
FROM base AS final
WORKDIR /app

# Copy the published application from the publish stage
COPY --from=publish /app/publish .

# Copy the wwwroot folder including images
COPY ./wwwroot /app/wwwroot

# Set the entry point for the application
ENTRYPOINT ["dotnet", "CafeManager.dll"]
