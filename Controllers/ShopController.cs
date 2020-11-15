
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace dnd_planner
{
    [Route("api/ShopController")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly ShopService _shopService;
            private readonly ItemService _itemService;
        public ShopController(ShopService service)
        {
            _shopService = service;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Shop>>> GetAll(string id)
        {
            var shops = await _shopService.GetAllAsync(id);
            System.Console.WriteLine(shops);
            return Ok(shops);
        }
        [HttpGet("{id}/byID")]
        public async Task<ActionResult<Shop>> GetById(string id)
        {
            var shop = await _shopService.GetByIdAsync(id);
            if (shop == null)
            {
                return NotFound();
            }
            return Ok(shop);
        }
        [HttpPost]
        public async Task<IActionResult> Create(Shop shop)
        {
            Item[] items = _itemService.GetAll().ToArray();
            System.Random rand = new System.Random();
            int index = 0;
            while(index < shop.Capacity){
                int itemIndex =  rand.Next(items.Length-1);
                int itemQty;
                if(shop.Capacity-index>=5){
                itemQty =  rand.Next(5);
                }
                else{
                itemQty =  rand.Next(shop.Capacity-index);
                }

                for(int j = 0; j<=itemQty; j++){
                    shop.items.Add(items[itemIndex]);
                    index++;
                }

            }

            await _shopService.CreateAsync(shop);
            return Ok(shop);
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, Shop updatedShop)
        {
            var queriedShop = await _shopService.GetByIdAsync(id);
            if (queriedShop == null)
            {
                return NotFound();
            }
            await _shopService.UpdateAsync(id, updatedShop);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var shop = await _shopService.GetByIdAsync(id);
            if (shop == null)
            {
                return NotFound();
            }
            await _shopService.DeleteAsync(id);
            return NoContent();
        }
    }
}