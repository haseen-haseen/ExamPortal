using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class SubmissionsModel
    {
        [JsonPropertyName("submissionId")]
        public int? SubmissionId { get; set; }

        [JsonPropertyName("userId")]
        public int? UserId { get; set; }

        [JsonPropertyName("formId")]
        public int? FormId { get; set; }

        [JsonPropertyName("referenceNo")]
        public string? ReferenceNo { get; set; }

        [JsonPropertyName("submittedData")]
        public string? SubmittedData { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; } = "Pending";

        [JsonPropertyName("remarks")]
        public string? Remarks { get; set; }

        [JsonPropertyName("submittedAt")]
        public string? SubmittedAt { get; set; } 

        [JsonPropertyName("updatedAt")]
        public string? UpdatedAt { get; set; }
        [JsonPropertyName("userName")]

        public string? UserName { get; set; }
        [JsonPropertyName("formTitle")]

        public string? FormTitle { get; set; }
        [JsonPropertyName("fee")]

        public Decimal? Fee { get; set; }
    }
}
