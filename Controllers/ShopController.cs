
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
        public ShopController(ShopService service)
        {
            _shopService = service;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shop>>> GetAll()
        {
            var shops = await _shopService.GetAllAsync();
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
        [HttpDelete]
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