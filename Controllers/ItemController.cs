
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace dnd_planner
{
    [Route("api/ItemsController")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly ItemService _itemService;
        public ItemsController(ItemService service)
        {
            _itemService = service;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetAll()
        {
            var items = await _itemService.GetAllAsync();
            System.Console.WriteLine(items);
            return Ok(items);
        }
        [HttpGet("{id}/byID")]
        public async Task<ActionResult<Item>> GetById(string id)
        {
            var item = await _itemService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
        [HttpPost]
        public async Task<IActionResult> Create(Item item)
        {
            await _itemService.CreateAsync(item);
            return Ok(item);
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, Item updatedItem)
        {
            var queriedItem = await _itemService.GetByIdAsync(id);
            if (queriedItem == null)
            {
                return NotFound();
            }
            await _itemService.UpdateAsync(id, updatedItem);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _itemService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            await _itemService.DeleteAsync(id);
            return NoContent();
        }
    }
}