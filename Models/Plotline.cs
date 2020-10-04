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
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public Character[] characters { get; set; }
        public string status { get; set; }
        public string CampaignsId { get; set; }
    }
    public class PlotlineService
    {
        private readonly IMongoCollection<Plotline> _plotlines;
        public PlotlineService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _plotlines = database.GetCollection<Plotline>(settings.PlotlineCollectionName);
        }
        public async Task<List<Plotline>> GetAllAsync()
        {
            return await _plotlines.Find(s => true).ToListAsync();
        }
        public async Task<Plotline> GetByIdAsync(string id)
        {
            return await _plotlines.Find<Plotline>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<Plotline> CreateAsync(Plotline campaigns)
        {
            await _plotlines.InsertOneAsync(campaigns);
            return campaigns;
        }
        public async Task UpdateAsync(string id, Plotline campaigns)
        {
            await _plotlines.ReplaceOneAsync(s => s.Id == id, campaigns);
        }
        public async Task DeleteAsync(string id)
        {
            await _plotlines.DeleteOneAsync(s => s.Id == id);
        }
    }
}