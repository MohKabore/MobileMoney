using System;

namespace MobileMoney.API.Dtos
{
    public class TransactionDto
    {
        public TransactionDto()
        {
            InsertDate = DateTime.Now;
        }

        public string Hour { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public int TransactionTypeId { get; set; }
        public int OperatorId { get; set; }
        public decimal? Commission { get; set; }
        public DateTime InsertDate { get; set; }
    }
}