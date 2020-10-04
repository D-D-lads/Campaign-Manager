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
    public class Plotline
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Details are required")]
        public string Details { get; set; }
        public string[] characters { get; set; }
        public string status { get; set; }
    }
    public class Campaigns
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required(ErrorMessage = "name is required")]
        public string Name { get; set; }
        public Plotline[] plotlines { get; set; }
        public string[] characters { get; set; }
    }
    public class CampaignService
    {
        private readonly IMongoCollection<Campaigns> _campaigns;
        public CampaignService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _campaigns = database.GetCollection<Campaigns>(settings.CampaignsCollectionName);
        }
        public async Task<List<Campaigns>> GetAllAsync()
        {
            return await _campaigns.Find(s => true).ToListAsync();
        }
        public async Task<Campaigns> GetByIdAsync(string id)
        {
            return await _campaigns.Find<Campaigns>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<Campaigns> CreateAsync(Campaigns campaigns)
        {
            await _campaigns.InsertOneAsync(campaigns);
            return campaigns;
        }
        public async Task UpdateAsync(string id, Campaigns campaigns)
        {
            await _campaigns.ReplaceOneAsync(s => s.Id == id, campaigns);
        }
        public async Task DeleteAsync(string id)
        {
            await _campaigns.DeleteOneAsync(s => s.Id == id);
        }
    }
}