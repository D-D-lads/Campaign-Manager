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
    public class Character
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required(ErrorMessage = "name is required")]
        public string Name { get; set; }
        public string Status { get; set; }
        public string CampaignsId { get; set; }
    }
    public class CharacterService
    {
        private readonly IMongoCollection<Character> _characters;
        public CharacterService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _characters = database.GetCollection<Character>(settings.CharacterCollectionName);
        }
        public async Task<List<Character>> GetAllAsync()
        {
            return await _characters.Find(s => true).ToListAsync();
        }
        public async Task<Character> GetByIdAsync(string id)
        {
            return await _characters.Find<Character>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<Character> CreateAsync(Character campaigns)
        {
            await _characters.InsertOneAsync(campaigns);
            return campaigns;
        }
        public async Task UpdateAsync(string id, Character campaigns)
        {
            await _characters.ReplaceOneAsync(s => s.Id == id, campaigns);
        }
        public async Task DeleteAsync(string id)
        {
            await _characters.DeleteOneAsync(s => s.Id == id);
        }
    }
}