using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobileMoney.API.Data;

namespace MobileMoney.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly DataContext _context;
        public TransactionController(DataContext context)
        {
            _context = context;

        }

        [HttpGet("GetOperators")]
        public async Task<IActionResult> GetOperators()
        {
            var operators = await _context.Operators.OrderBy(o => o.Name).ToListAsync();
            return Ok(operators);
        }

    }
}