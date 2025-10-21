using Backend.Classes;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Backend.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize]
    public class SubmissionController : ControllerBase
    {
        private readonly DatabaseConnection _db;
        private readonly Validations _validations;

        public SubmissionController(IConfiguration configuration)
        {
            _db = new DatabaseConnection(configuration);
            _validations = new Validations(configuration);

        }

        // GET /submissions?userId=1

        [HttpGet]
        public IActionResult GetSubmissions([FromQuery] int? userId, [FromQuery] int? submissionId)
        {
            try
            {
                // Base query with joins
                string query = @"
            SELECT 
                s.SubmissionId,
                s.UserId,
                u.UserName,
                s.FormId,
                f.Title AS FormTitle,
                f.Fee AS FormFee,
                s.ReferenceNo,
                s.SubmittedData,
                s.Status,
                s.Remarks,
                s.SubmittedAt,
                s.UpdatedAt
            FROM Submissions s
            INNER JOIN Users u ON s.UserId = u.UserId
            INNER JOIN Forms f ON s.FormId = f.FormId
            WHERE 1=1
        ";

                if (submissionId.HasValue)
                {
                    query += $" AND s.SubmissionId = {submissionId}";
                }
                else if (userId.HasValue)
                {
                    query += $" AND s.UserId = {userId}";
                }

                var dt = _db.ExecuteQuery(query);

                var submissions = new List<SubmissionsModel>();
                foreach (DataRow row in dt.Rows)
                {
                    submissions.Add(new SubmissionsModel
                    {
                        SubmissionId = Convert.ToInt32(row["SubmissionId"]),
                        UserId = Convert.ToInt32(row["UserId"]),
                        UserName = row["UserName"]?.ToString(),
                        FormId = Convert.ToInt32(row["FormId"]),
                        FormTitle = row["FormTitle"]?.ToString(),
                        Fee = row["FormFee"] != DBNull.Value ? Convert.ToDecimal(row["FormFee"]) : 0,
                        ReferenceNo = row["ReferenceNo"]?.ToString(),
                        SubmittedData = row["SubmittedData"]?.ToString(),
                        Status = row["Status"]?.ToString(),
                        Remarks = row["Remarks"]?.ToString(),
                        SubmittedAt = Convert.ToDateTime(row["SubmittedAt"]).ToString("yyyy-MM-dd HH:mm:ss"),
                        UpdatedAt = row["UpdatedAt"] != DBNull.Value ? Convert.ToDateTime(row["UpdatedAt"]).ToString("yyyy-MM-dd HH:mm:ss") : null
                    });
                }

                if (submissionId.HasValue)
                {
                    return Ok(submissions.FirstOrDefault());
                }

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        
        [HttpPost("create")]
        public IActionResult Create([FromBody] SubmissionsModel model)
        {
            try
            {
                if (model.UserId == null || model.FormId == null)
                    return BadRequest(new { message = "UserId and FormId are required." });

                var duplicacyParameter = new CheckDuplicacyPerameter
                {
                    tableName = "Submissions",
                    fields = new[] { "UserId", "FormId" },
                    values = new[] { model.UserId.ToString(), model.FormId.ToString() },
                    andFlag = true 
                };

                if (_validations.CheckDuplicateRecord(duplicacyParameter))
                {
                    return Conflict(new { message = "You have already submitted this form." });
                }

                string referenceNo = "REF" + DateTime.Now.Ticks;
                string submittedData = model.SubmittedData?.Replace("'", "''"); // escape single quotes
                string remarks = model.Remarks?.Replace("'", "''"); // escape single quotes

                string query = $@"
            INSERT INTO Submissions (UserId, FormId, ReferenceNo, SubmittedData, Status, Remarks, SubmittedAt)
            VALUES ({model.UserId}, {model.FormId}, '{referenceNo}', 
                    {(submittedData != null ? $"'{submittedData}'" : "NULL")},
                    '{model.Status}', 
                    {(remarks != null ? $"'{remarks}'" : "NULL")},
                    GETDATE()
            )";

                _db.ExecuteNonQuery(query);

                return Ok(new { message = "Submission created successfully", referenceNo });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }


        [HttpPut("update/{id}")]
        public IActionResult Update(int id, [FromBody] SubmissionsModel model)
        {
            try
            {
                model.UpdatedAt = DateTime.Now.ToString();
                string submittedData = model.SubmittedData?.Replace("'", "''");

                string query = $@"
                    UPDATE Submissions SET
                        SubmittedData = {(submittedData != null ? $"'{submittedData}'" : "NULL")},
                        Status = '{model.Status}',
                        Remarks = {(model.Remarks != null ? $"'{model.Remarks}'" : "NULL")},
                        UpdatedAt = GETDATE()
                    WHERE SubmissionId = {id}";

                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("Submission not found.");

                return Ok("Submission updated successfully");
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
                string checkQuery = $"SELECT COUNT(*) FROM Payments WHERE SubmissionId = {id}";
                int submissionCount = Convert.ToInt32(_db.ExecuteScalar(checkQuery));

                if (submissionCount > 0)
                {
                    return StatusCode(StatusCodes.Status409Conflict,
                        new { message = "submissions exists in Payments and cannot be deleted." });
                }
                string query = $"DELETE FROM Submissions WHERE SubmissionId = {id}";
                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("Submission not found.");
                return StatusCode(StatusCodes.Status200OK, new { message = "Submission deleted successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
