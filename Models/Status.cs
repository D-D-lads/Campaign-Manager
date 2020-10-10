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
    public class Status
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Title { get; set; }
        public string CampaignsId { get; set; }
    }
    public class StatusService
    {
        private readonly IMongoCollection<Status> _statuses;
        public StatusService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _statuses = database.GetCollection<Status>(settings.StatusCollectionName);
        }
        public async Task<List<Status>> GetAllAsync()
        {
            return await _statuses.Find(s => true).ToListAsync();
        }
        public async Task<Status> GetByIdAsync(string id)
        {
            return await _statuses.Find<Status>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<List<Status>> GetByCampaignAsync(string id)
        {
            return await _statuses.Find(s => s.CampaignsId == id).ToListAsync();
        }
        public async Task<Status> CreateAsync(Status campaigns)
        {
            await _statuses.InsertOneAsync(campaigns);
            return campaigns;
        }
        public async Task UpdateAsync(string id, Status campaigns)
        {
            await _statuses.ReplaceOneAsync(s => s.Id == id, campaigns);
        }
        public async Task DeleteAsync(string id)
        {
            await _statuses.DeleteOneAsync(s => s.Id == id);
        }
    }
}