using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Amazon.Extensions.NETCore.Setup;
using Amazon;

namespace MapCore.Admin.Models
{
    public partial class G_GmapContext : DbContext
    {
        private readonly IWebHostBuilder _env;

        public G_GmapContext()
        {
        }

        public G_GmapContext(IConfiguration configuration, IWebHostBuilder env)
        {
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        public virtual DbSet<CProvGeoConfig> CProvGeoConfig { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var awsOptions = new AWSOptions { Region = RegionEndpoint.USEast1, Profile = "default", ProfilesLocation = "C:\\aws_config\\credentials" };
            var connectionStringProvider = new ConnectionStringProvider(awsOptions);
            string mapCoreCennectionString = connectionStringProvider.GetConnectionString("/app/MapFramework/MainConnectionString").Result;
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(mapCoreCennectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<CProvGeoConfig>(entity =>
            {
                entity.HasKey(e => e.EntityId)
                    .HasName("PK__C_Prov_G__AF9F95A7A0A73B89");

                entity.ToTable("C_Prov_Geo_Config");

                entity.Property(e => e.EntityId)
                    .HasColumnName("entity_id")
                    .HasMaxLength(25)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.CbsaCode)
                    .HasColumnName("cbsa_code")
                    .IsUnicode(false);

                entity.Property(e => e.CbsaName)
                    .HasColumnName("cbsa_name")
                    .IsUnicode(false);

                entity.Property(e => e.City)
                    .HasColumnName("city")
                    .IsUnicode(false);

                entity.Property(e => e.CountyFips)
                    .HasColumnName("county_fips")
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.CountyLongName)
                    .HasColumnName("county_long_name")
                    .IsUnicode(false);

                entity.Property(e => e.GmapLat)
                    .HasColumnName("gmap_lat")
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.GmapLng)
                    .HasColumnName("gmap_lng")
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.MarkerId).HasColumnName("marker_id");

                entity.Property(e => e.ProvName).HasColumnName("name");

                entity.Property(e => e.Src)
                    .HasColumnName("src")
                    .IsUnicode(false);

                entity.Property(e => e.StateFips)
                    .HasColumnName("state_fips")
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.StateLongName)
                    .HasColumnName("state_long_name")
                    .IsUnicode(false);

                entity.Property(e => e.StateShortName)
                    .HasColumnName("state_short_name")
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Zip)
                    .HasColumnName("zip")
                    .HasMaxLength(5)
                    .IsUnicode(false);
            });
        }
    }
}
