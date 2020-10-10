
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace dnd_planner
{
    [Route("api/StatusController")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly StatusService _statusService;
        public StatusController(StatusService service)
        {
            _statusService = service;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Status>>> GetAll(string id)
        {
            var statuses = await _statusService.GetByCampaignAsync(id);
            System.Console.WriteLine(statuses);
            return Ok(statuses);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Status status)
        {
            await _statusService.CreateAsync(status);
            return Ok(status);
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, Status updatedStatus)
        {
            var queriedStatus = await _statusService.GetByIdAsync(id);
            if (queriedStatus == null)
            {
                return NotFound();
            }
            await _statusService.UpdateAsync(id, updatedStatus);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var status = await _statusService.GetByIdAsync(id);
            if (status == null)
            {
                return NotFound();
            }
            await _statusService.DeleteAsync(id);
            return NoContent();
        }
    }
}