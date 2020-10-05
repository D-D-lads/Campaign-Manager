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
    [Route("api/PlotlineController")]
    [ApiController]
    public class PlotlineController : ControllerBase
    {
        private readonly PlotlineService _plotlineService;
        public PlotlineController(PlotlineService service)
        {
            _plotlineService = service;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Plotline>>> GetAll(string id)
        {
            var plotlines = await _plotlineService.GetByCampaignAsync(id);
            System.Console.WriteLine(plotlines);
            return Ok(plotlines);
        }
        [HttpGet("{id}/byID")]
        public async Task<ActionResult<Plotline>> GetById(string id)
        {
            var plotline = await _plotlineService.GetByIdAsync(id);
            if (plotline == null)
            {
                return NotFound();
            }
            return Ok(plotline);
        }
        [HttpPost]
        public async Task<IActionResult> Create(Plotline plotline)
        {
            await _plotlineService.CreateAsync(plotline);
            return Ok(plotline);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Plotline updatedPlotline)
        {
            var queriedPlotline = await _plotlineService.GetByIdAsync(id);
            if (queriedPlotline == null)
            {
                return NotFound();
            }
            await _plotlineService.UpdateAsync(id, updatedPlotline);
            return NoContent();
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            var plotline = await _plotlineService.GetByIdAsync(id);
            if (plotline == null)
            {
                return NotFound();
            }
            await _plotlineService.DeleteAsync(id);
            return NoContent();
        }
    }
}