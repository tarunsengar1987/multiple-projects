using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VistaBasket.Catalog.Service.Interface;
using VistaBasket.Catalog.Service.Model;
using VistaBasket.Catalog.Service.Model.Brand;

namespace VistaBasket.Catalog.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;
        private ResponseDto _response;
        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
            _response = new ResponseDto();
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _brandService.GetAll();
            _response.Result = result;
            _response.IsSuccess = true;
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BrandDto brand)
        {
            var result = await _brandService.Create(brand);
            _response.Result = result;
            _response.IsSuccess = true;
            _response.Message = "Brand created successfully.";
            return Ok(_response);
        }
    }
}
