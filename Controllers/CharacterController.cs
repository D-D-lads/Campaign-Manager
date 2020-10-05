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
    [Route("api/CharacterController")]
    [ApiController]
    public class CharacterController : ControllerBase
    {
        private readonly CharacterService _characterService;
        public CharacterController(CharacterService service)
        {
            _characterService = service;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Character>>> GetAll(string id)
        {
            var characters = await _characterService.GetByCampaignAsync(id);
            System.Console.WriteLine(characters);
            return Ok(characters);
        }

        [HttpGet("{id}/byID")]
        public async Task<ActionResult<Character>> GetById(string id)
        {
            var character = await _characterService.GetByIdAsync(id);
            if (character == null)
            {
                return NotFound();
            }
            return Ok(character);
        }
        [HttpPost]
        public async Task<IActionResult> Create(Character character)
        {
            await _characterService.CreateAsync(character);
            return Ok(character);
        }
        [HttpPut]
        public async Task<IActionResult> Update(string id, Character updatedCharacter)
        {
            var queriedCharacter = await _characterService.GetByIdAsync(id);
            if (queriedCharacter == null)
            {
                return NotFound();
            }
            await _characterService.UpdateAsync(id, updatedCharacter);
            return NoContent();
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            var character = await _characterService.GetByIdAsync(id);
            if (character == null)
            {
                return NotFound();
            }
            await _characterService.DeleteAsync(id);
            return NoContent();
        }
    }
}