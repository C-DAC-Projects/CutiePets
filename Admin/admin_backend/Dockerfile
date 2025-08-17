# =========================
# 1. Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything into /src
COPY . .

# Restore dependencies
RUN dotnet restore "Admin_Backend.csproj"

# Build and publish in Release mode
RUN dotnet publish "Admin_Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false


# =========================
# 2. Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files
COPY --from=build /app/publish .

# Expose port 8080 for Railway
EXPOSE 8080

# Tell ASP.NET Core to listen on port 8080
ENV ASPNETCORE_URLS=http://+:8080

# Run your app
ENTRYPOINT ["dotnet", "Admin_Backend.dll"]
