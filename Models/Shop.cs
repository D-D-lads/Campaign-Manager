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
    public class Shop
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required(ErrorMessage = "name is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "City is required")]
        public string City { get; set; }
        [Required(ErrorMessage = "Capacity is required")]
        public int Capacity { get; set; } 
        public List<Item> items {get;set;}

    }
    public class ShopService
    {
        private readonly IMongoCollection<Shop> _shop;
        public ShopService(IDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _shop = database.GetCollection<Shop>(settings.ShopCollectionName);
        }
        public async Task<List<Shop>> GetAllAsync(string cityId)
        {
            return await _shop.Find(s => s.City == cityId).ToListAsync();
        }
        public async Task<Shop> GetByIdAsync(string id)
        {
            return await _shop.Find<Shop>(s => s.Id == id).FirstOrDefaultAsync();
        }
        public async Task<Shop> CreateAsync(Shop shop)
        {
            await _shop.InsertOneAsync(shop);
            return shop;
        }
        public async Task UpdateAsync(string id, Shop shop)
        {
            await _shop.ReplaceOneAsync(s => s.Id == id, shop);
        }
        public async Task DeleteAsync(string id)
        {
            await _shop.DeleteOneAsync(s => s.Id == id);
        }
    }
}