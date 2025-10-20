using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class FormsModel
    {
        [JsonPropertyName("formId")]
        public int? FormId { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("examDate")]
        public string? ExamDate { get; set; }

        [JsonPropertyName("registrationStartDate")]
        public string? RegistrationStartDate { get; set; }

        [JsonPropertyName("registrationEndDate")]
        public string? RegistrationEndDate { get; set; }

        [JsonPropertyName("fee")]
        public decimal? Fee { get; set; }

        [JsonPropertyName("createdBy")]
        public int? CreatedBy { get; set; }

        [JsonPropertyName("createdAt")]
        public string? CreatedAt { get; set; }

        [JsonPropertyName("updatedAt")]
        public string? UpdatedAt { get; set; }

        [JsonPropertyName("creator")]
        public string? CreatedByUser { get; set; }
    }
}
