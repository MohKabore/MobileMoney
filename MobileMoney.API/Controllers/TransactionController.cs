using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobileMoney.API.Data;
using MobileMoney.API.Dtos;
using MobileMoney.API.Models;

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

        [HttpPost("CreateTransaction")]
        public async Task<IActionResult> CreateTransaction(TransactionDto transactionToCreate)
        {
            var trans = new Transaction
            {
                Amount = transactionToCreate.Amount,
                TransactionDate = transactionToCreate.Date,
                TransactionTypeId = transactionToCreate.TransactionTypeId,
                OperatorId = transactionToCreate.OperatorId,
                // Commission = transactionToCreate.Commission
            };
            // edition de l'heure
            // var tableau_heure = transactionToCreate.Hour.ToCharArray();
            var h = Convert.ToInt32(transactionToCreate.Hour.Substring(0, 2));
            var min = Convert.ToInt32(transactionToCreate.Hour.Substring(3, 2));
            TimeSpan ts = new TimeSpan(h, min, 0);
            trans.TransactionDate = trans.TransactionDate.Date + ts;
            _context.Add(trans);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                return Ok();
            else
                return BadRequest();
        }

    }
}