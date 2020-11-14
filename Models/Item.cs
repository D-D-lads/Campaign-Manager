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
    public class Item
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Description is required")]
        public string Desc { get; set; }
        [Required(ErrorMessage = "Campaign is required")]
        public string Rarity { get; set; }
    }
    public class ItemService
    {
        private readonly IMongoCollection<Item> _item;
        public ItemService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _item = database.GetCollection<Item>(settings.ItemCollectionName);
        }
        public async Task<List<Item>> GetAllAsync()
        {
            return await _item.Find(s => true).ToListAsync();
        }
        public async Task<Item> GetByIdAsync(string id)
        {
            return await _item.Find<Item>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<Item> CreateAsync(Item item)
        {
            await _item.InsertOneAsync(item);
            return item;
        }
        public async Task UpdateAsync(string id, Item item)
        {
            await _item.ReplaceOneAsync(s => s.Id == id, item);
        }
        public async Task DeleteAsync(string id)
        {
            await _item.DeleteOneAsync(s => s.Id == id);
        }
    }
}