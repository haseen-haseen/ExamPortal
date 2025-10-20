using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class PaymentsModel
    {
        [JsonPropertyName("paymentId")]
        public int? PaymentId { get; set; }

        [JsonPropertyName("submissionId")]
        public int? SubmissionId { get; set; }

        [JsonPropertyName("paymentGateway")]
        public string? PaymentGateway { get; set; }

        [JsonPropertyName("transactionId")]
        public string? TransactionId { get; set; } 

        [JsonPropertyName("paymentMethod")]
        public string? PaymentMethod { get; set; }

        [JsonPropertyName("amount")]
        public decimal? Amount { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; } = "Success";

        [JsonPropertyName("receiptUrl")]
        public string? ReceiptUrl { get; set; }

        [JsonPropertyName("paymentDate")]
        public string? PaymentDate { get; set; } 

        [JsonPropertyName("updatedAt")]
        public string? UpdatedAt { get; set; }
    }
}
