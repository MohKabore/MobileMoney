using System;

namespace MobileMoney.API.Models
{
    public class Transaction
    {
        public Transaction()
        {
            InsertDate = DateTime.Now;
        }
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal Amount { get; set; }
        public int TransactionTypeId { get; set; }
        public TransactionType TransactionType { get; set; }
        public int OperatorId { get; set; }
        public Operator Operator { get; set; }
        public decimal Commission { get; set; }
        public DateTime InsertDate { get; set; }
    }
}