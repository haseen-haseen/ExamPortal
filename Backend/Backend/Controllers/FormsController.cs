using Backend.Classes;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Backend.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class FormsController : ControllerBase
    {
        private readonly DatabaseConnection _db;
        private readonly Validations _validations;

        public FormsController(IConfiguration configuration)
        {
            _db = new DatabaseConnection(configuration);
            _validations = new Validations(configuration);
        }

        // GET /Forms or /Forms?formId=1
        [HttpGet]
        public IActionResult GetForms([FromQuery] int? formId)
        {
            try
            {
                string query = "SELECT f.*, u.UserName as CreatedByUser FROM Forms f LEFT JOIN Users u ON f.CreatedBy = u.UserId";
                if (formId.HasValue)
                    query += $" WHERE f.FormId = {formId.Value}";

                var dt = _db.ExecuteQuery(query);
                var formsList = new List<FormsModel>();

                foreach (DataRow row in dt.Rows)
                {
                    formsList.Add(new FormsModel
                    {
                        FormId = Convert.ToInt32(row["FormId"]),
                        Title = row["Title"].ToString(),
                        Description = row["Description"].ToString(),
                        ExamDate = row["ExamDate"].ToString(),
                        RegistrationStartDate = row["RegistrationStartDate"].ToString(),
                        RegistrationEndDate = row["RegistrationEndDate"].ToString(),
                        Fee = row["Fee"] != DBNull.Value ? Convert.ToDecimal(row["Fee"]) : 0,
                        CreatedBy = row["CreatedBy"] != DBNull.Value ? Convert.ToInt32(row["CreatedBy"]) : 0,
                        CreatedByUser = row["CreatedByUser"].ToString(),
                        CreatedAt = row["CreatedAt"].ToString(),
                        UpdatedAt = row["UpdatedAt"] != DBNull.Value ? row["UpdatedAt"].ToString() : null
                    });
                }

                return Ok(formsList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // POST /Forms/create
        [HttpPost("create")]
        public IActionResult Create([FromBody] FormsModel form)
        {
            try
            {
                if (string.IsNullOrEmpty(form.Title))
                    return BadRequest("Title cannot be empty");

                string query = $@"
                    INSERT INTO Forms (Title, Description, ExamDate, RegistrationStartDate, RegistrationEndDate, Fee, CreatedBy, CreatedAt)
                    VALUES (
                        '{form.Title}', 
                        '{form.Description}', 
                        '{form.ExamDate}', 
                        '{form.RegistrationStartDate}', 
                        '{form.RegistrationEndDate}', 
                        {form.Fee}, 
                        {form.CreatedBy}, 
                        GETDATE()
                    )";

                _db.ExecuteNonQuery(query);
                return Ok("Form created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        // PUT /Forms/update
        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] FormsModel form)
        {
            try
            {
                if (string.IsNullOrEmpty(form.ExamDate))
                    return BadRequest("ExamDate cannot be null or empty.");

                string title = string.IsNullOrEmpty(form.Title) ? "NULL" : $"'{form.Title.Replace("'", "''")}'";
                string description = string.IsNullOrEmpty(form.Description) ? "NULL" : $"'{form.Description.Replace("'", "''")}'";
                string examDate = $"'{form.ExamDate}'";
                string regStart = string.IsNullOrEmpty(form.RegistrationStartDate) ? "NULL" : $"'{form.RegistrationStartDate}'";
                string regEnd = string.IsNullOrEmpty(form.RegistrationEndDate) ? "NULL" : $"'{form.RegistrationEndDate}'";
                string feeValue = form.Fee.HasValue ? form.Fee.Value.ToString() : "0";

                string query = $@"
            UPDATE Forms SET 
                Title = {title}, 
                Description = {description}, 
                ExamDate = {examDate}, 
                RegistrationStartDate = {regStart}, 
                RegistrationEndDate = {regEnd}, 
                Fee = {feeValue}, 
                UpdatedAt = GETDATE()
            WHERE FormId = {id}";

                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("Form not found");

                return Ok("Form updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        // DELETE /Forms/delete/{id}
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                string checkQuery = $"SELECT COUNT(*) FROM Submissions WHERE FormId = {id}";
                int submissionCount =Convert.ToInt32(_db.ExecuteScalar(checkQuery));

                if (submissionCount > 0)
                {
                    return StatusCode(StatusCodes.Status409Conflict,
                        new { message = "Form exists in submissions and cannot be deleted." });
                }
                string query = $"DELETE FROM Forms WHERE FormId={id}";
                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("Form not found");

                return StatusCode(StatusCodes.Status200OK,
                    new { message = "Form deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
