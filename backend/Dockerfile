FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia e restaura as dependências primeiro para aproveitar o cache do Docker
COPY ["Portfol.Api.csproj", "./"]
RUN dotnet restore "Portfol.Api.csproj"

# Copia o restante do código
COPY . .
RUN dotnet publish "Portfol.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# -------------------------
# Fase de Execução (Runtime)
# -------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Usaremos a variável PORT injetada pelo ambiente (Render/Heroku/Railway) padrão.
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Portfol.Api.dll"]
