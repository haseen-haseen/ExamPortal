using Backend.Classes;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly DatabaseConnection _db;
        private readonly Validations _validations;
        private readonly IConfiguration _configuration;

        public UsersController( IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DatabaseConnection(configuration);
            _validations = new Validations(configuration);
        }

        [HttpGet]
        public IActionResult GetAllUsers([FromQuery] int? userId)
        {
            try
            {
                string query = "SELECT * FROM Users ";
                if (userId.HasValue)
                {
                    query += $" where UserId = {userId} ";

                }
                var dt = _db.ExecuteQuery(query);


                var userList = new List<UsersModel>();
                foreach (DataRow row in dt.Rows)
                {
                    string hashedPassword = _validations.Decrypt("EncryptionKey", row["Password"].ToString());
                    userList.Add(new UsersModel
                    {
                        UserId = Convert.ToInt32(row["UserId"]),
                        UserName = row["UserName"].ToString(),
                        Email = row["Email"].ToString(),
                        Password = hashedPassword,
                        Phone = row["Phone"] != DBNull.Value ? row["Phone"].ToString() : null,
                        Role = row["Role"].ToString(),
                        IsActive = Convert.ToBoolean(row["IsActive"]),
                        CreatedAt = Convert.ToDateTime(row["CreatedAt"]).ToString(),
                        UpdatedAt = row["UpdatedAt"] != DBNull.Value ? Convert.ToDateTime(row["UpdatedAt"]).ToString() : null
                    });
                }

                return Ok(userList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UsersModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest(new { message = "Email and password are required." });
                }

                string encryptedPassword = _validations.Encrypt("EncryptionKey", model.Password);

                var dt = _db.ExecuteQuery(
                    $"SELECT * FROM Users WHERE Email='{model.Email}' AND Password='{encryptedPassword}'");

                if (dt.Rows.Count == 0)
                {
                    return Unauthorized(new { message = "Invalid email or password." });
                }

                var row = dt.Rows[0];

                bool isActive = row["IsActive"] != DBNull.Value && Convert.ToBoolean(row["IsActive"]);
                if (!isActive)
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                        new { message = "Your account is deactivated. Please contact the administrator." });
                }

                var claims = new[]
                {
            new Claim(JwtRegisteredClaimNames.Sub, row["Email"].ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("UserId", row["UserId"].ToString()),
            new Claim(ClaimTypes.Role, row["Role"].ToString())
        };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(2),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                var user = new UsersModel
                {
                    UserId = Convert.ToInt32(row["UserId"]),
                    UserName = row["UserName"].ToString(),
                    Email = row["Email"].ToString(),
                    Phone = row["Phone"] != DBNull.Value ? row["Phone"].ToString() : null,
                    Role = row["Role"].ToString(),
                    IsActive = isActive,
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"]).ToString(),
                    UpdatedAt = row["UpdatedAt"] != DBNull.Value
                        ? Convert.ToDateTime(row["UpdatedAt"]).ToString()
                        : null
                };

                return Ok(new
                {
                    message = "Login successful.",
                    token = tokenString,
                    role = user.Role,
                    username = user.UserName,
                    userId = user.UserId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }



        [HttpPost("create")]
        [HttpPost("register")]
        public IActionResult Create([FromBody] UsersModel user)
        {
            try
            {
                if (string.IsNullOrEmpty(user.UserName))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "Username can't be blank." });
                }

                user.UserName = _validations.ConvertLetterCase(new LetterCasePerameter
                {
                    caseType = "titlecase",
                    column = user.UserName
                });

                var duplicacyParameter = new CheckDuplicacyPerameter
                {
                    tableName = "Users",
                    fields = new[] { "UserName", "Email" },
                    values = new[] { user.UserName, user.Email }
                };

                if (_validations.CheckDuplicateRecord(duplicacyParameter))
                {
                    return StatusCode(StatusCodes.Status200OK, new { message = "User already exists." });
                }

                user.UpdatedAt = DateTime.Now.ToString();

                string hashedPassword = _validations.Encrypt("EncryptionKey", user.Password);
                string query = $@"
            INSERT INTO Users (UserName, Email, Password, Phone, Role, IsActive, CreatedAt, UpdatedAt)
            VALUES ('{user.UserName}', '{user.Email}', '{hashedPassword}', 
                    {(user.Phone != null ? $"'{user.Phone}'" : "NULL")}, 
                    'User',{true}, 
                    GETDATE(), GETDATE())";

                _db.ExecuteNonQuery(query);
                return Ok(new { message = "User created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }


        [HttpPut("update/{id}")]

        public IActionResult Update(int id, [FromBody] UsersModel user)
        {
            try
            {
                user.UserName = _validations.ConvertLetterCase(new LetterCasePerameter
                {
                    caseType = "titlecase",
                    column = user.UserName
                });
                var duplicacyParameter = new CheckDuplicacyPerameter
                {
                    tableName = "Users",
                    fields = new[] { "UserName", "Email" },
                    values = new[] { user.UserName, user.Email },
                    idField = "UserId",
                    idValue = id.ToString()
                };

                if (_validations.CheckDuplicateRecord(duplicacyParameter))
                {

                    return StatusCode(StatusCodes.Status208AlreadyReported, "User already exists.");
                }


                user.UpdatedAt = DateTime.Now.ToString();
                string hashedPassword = _validations.Encrypt("EncryptionKey", user.Password);

                string query = $@"
                    UPDATE Users SET 
                        UserName='{user.UserName}', 
                        Email='{user.Email}', 
                        Password='{hashedPassword}', 
                        Phone={(user.Phone != null ? $"'{user.Phone}'" : "NULL")}, 
                        Role='{user.Role}', 
                        IsActive={(user.IsActive == true ? 1 : 0)}, 
                        UpdatedAt=GETDATE()
                    WHERE UserId={id}";

                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("User not found");

                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("delete/{id}")]

        public IActionResult Delete(int id)
        {
            try
            {
                string checkQuery = $"SELECT COUNT(*) FROM Submissions WHERE UserId = {id}";
                int submissionCount = Convert.ToInt32(_db.ExecuteScalar(checkQuery));

                if (submissionCount > 0)
                {
                    return StatusCode(StatusCodes.Status409Conflict,
                        new { message = "User exists in submissions and cannot be deleted." });
                }
                string query = $"DELETE FROM Users WHERE UserId={id}";
                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("User not found");
                return StatusCode(StatusCodes.Status200OK, new { message = "User deleted successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}
