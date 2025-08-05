# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything
COPY . ./

# Restore and publish
RUN dotnet publish AccountsAPI/AccountsAPI.csproj -c Release -o /out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Expose the port that Render expects
ENV PORT 10000
EXPOSE 10000

# Start the application
ENTRYPOINT ["dotnet", "AccountsAPI.dll"]
