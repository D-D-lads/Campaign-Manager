using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.Core;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Data.Common;
using Microsoft.AspNetCore.Mvc;

namespace dnd_planner
{
    [Route("api/CampaignsController")]
    [ApiController]
    public class CampaignsController : ControllerBase
    {
        private readonly CampaignService _campaignService;
        public CampaignsController(CampaignService service)
        {
            _campaignService = service;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Campaigns>>> GetAll()
        {
            var campaigns = await _campaignService.GetAllAsync();
            System.Console.WriteLine(campaigns);
            return Ok(campaigns);
        }
        public async Task<ActionResult<Campaigns>> GetById(string id)
        {
            var campaign = await _campaignService.GetByIdAsync(id);
            if (campaign == null)
            {
                return NotFound();
            }
            return Ok(campaign);
        }
        [HttpPost]
        public async Task<IActionResult> Create(Campaigns campaign)
        {
            await _campaignService.CreateAsync(campaign);
            return Ok(campaign);
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, Campaigns updatedCampaign)
        {
            var queriedCampaign = await _campaignService.GetByIdAsync(id);
            if (queriedCampaign == null)
            {
                return NotFound();
            }
            await _campaignService.UpdateAsync(id, updatedCampaign);
            return NoContent();
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            var campaign = await _campaignService.GetByIdAsync(id);
            if (campaign == null)
            {
                return NotFound();
            }
            await _campaignService.DeleteAsync(id);
            return NoContent();
        }
    }
}