using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.Core;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace dnd_planner
{
    public class City
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required(ErrorMessage = "name is required")]
        public string Name { get; set; }
        public string CampaignsId { get; set; }
    }
    public class CityService
    {
        private readonly IMongoCollection<City> _citys;
        public CityService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _citys = database.GetCollection<City>(settings.CityCollectionName);
        }
        public async Task<List<City>> GetAllAsync()
        {
            return await _citys.Find(s => true).ToListAsync();
        }
        public async Task<City> GetByIdAsync(string id)
        {
            return await _citys.Find<City>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<List<City>> GetByCampaignAsync(string id)
        {
            return await _citys.Find(s => s.CampaignsId == id).ToListAsync();
        }
        public async Task<City> CreateAsync(City campaigns)
        {
            await _citys.InsertOneAsync(campaigns);
            return campaigns;
        }
        public async Task UpdateAsync(string id, City campaigns)
        {
            await _citys.ReplaceOneAsync(s => s.Id == id, campaigns);
        }
        public async Task DeleteAsync(string id)
        {
            await _citys.DeleteOneAsync(s => s.Id == id);
        }
    }
}