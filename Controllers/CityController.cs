
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace dnd_planner
{
    [Route("api/CityController")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly CityService _cityService;
        public CityController(CityService service)
        {
            _cityService = service;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<City>>> GetAll(string id)
        {
            var cities = await _cityService.GetByCampaignAsync(id);
            return Ok(cities);
        }
        [HttpGet("{id}/byID")]
        public async Task<ActionResult<City>> GetById(string id)
        {
            var city = await _cityService.GetByIdAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            return Ok(city);
        }
        [HttpPost]
        public async Task<IActionResult> Create(City city)
        {
            await _cityService.CreateAsync(city);
            return Ok(city);
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, City updatedCity)
        {
            var queriedCity = await _cityService.GetByIdAsync(id);
            if (queriedCity == null)
            {
                return NotFound();
            }
            await _cityService.UpdateAsync(id, updatedCity);
            return NoContent();
        }
        [HttpDelete ("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var city = await _cityService.GetByIdAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            await _cityService.DeleteAsync(id);
            return NoContent();
        }
    }
}