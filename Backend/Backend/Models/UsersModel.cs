using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class UsersModel
    {
        [JsonPropertyName("userId")]
        public int? UserId { get; set; }

        [JsonPropertyName("userName")]
        public string? UserName { get; set; } 

        [JsonPropertyName("email")]
        public string? Email { get; set; } 

        [JsonPropertyName("password")]
        public string? Password { get; set; } 

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [JsonPropertyName("role")]
        public string? Role { get; set; } 

        [JsonPropertyName("isActive")]
        public bool? IsActive { get; set; } 

        [JsonPropertyName("createdAt")]
        public string? CreatedAt { get; set; } 

        [JsonPropertyName("updatedAt")]
        public string? UpdatedAt { get; set; } 
    }
}
