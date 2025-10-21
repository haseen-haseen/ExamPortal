using Backend.Classes;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Data;
using System.Reflection.Metadata;
using System.Security.Claims;
using Document = QuestPDF.Fluent.Document;


namespace Backend.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly DatabaseConnection _db;
        private readonly Validations _validations;

        public PaymentsController(IConfiguration configuration
            )
        {
            _db = new DatabaseConnection(configuration);
            _validations = new Validations(configuration);
        }


        [HttpPost("create")]
        public IActionResult CreatePayment([FromBody] PaymentsModel payment)
        {
            try
            {
                if (payment.SubmissionId == null || payment.Amount == null || string.IsNullOrEmpty(payment.TransactionId))
                    return BadRequest("Missing required payment details.");

               

                CheckDuplicacyPerameter checkParams = new CheckDuplicacyPerameter
                {
                    tableName = "Payments",
                    fields = new string[] { "SubmissionId" },
                    values = new string[] { payment.SubmissionId.ToString() },
                    andFlag = true
                };

                bool isDuplicate = _validations.CheckDuplicateRecord(checkParams);

                if (isDuplicate)
                {
                    return Conflict(new { message = "Payment already exists for this submission. Duplicate payments are not allowed." });
                }

                string query = $@"
            INSERT INTO Payments (SubmissionId, PaymentGateway, TransactionId, PaymentMethod, Amount, Status, ReceiptUrl, PaymentDate, UpdatedAt)
            VALUES ({payment.SubmissionId},
                    '{payment.PaymentGateway}',
                    '{payment.TransactionId}',
                    '{payment.PaymentMethod}',
                    {payment.Amount},
                    '{payment.Status}',
                    '{payment.ReceiptUrl}',
                    GETDATE(),
                    GETDATE())";

                _db.ExecuteNonQuery(query);

                return Ok(new { message = "Payment record created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }



        [HttpPost("verify")]
        public IActionResult VerifyPayment([FromBody] PaymentsModel payment)
        {
            try
            {
                if (string.IsNullOrEmpty(payment.TransactionId))
                    return BadRequest("TransactionId is required.");

                string query = $@"
            UPDATE Payments 
            SET Status = '{payment.Status}', 
                UpdatedAt = GETDATE()
            WHERE TransactionId = '{payment.TransactionId}'";

                int rows = _db.ExecuteNonQuery(query);
                if (rows == 0) return NotFound("Payment not found");

                return Ok(new { message = "Payment status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpGet]
        public IActionResult GetPayments()
        {
            try
            {
                // Get role and userId from JWT token
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                var userIdClaim = User.FindFirst("UserId")?.Value;

                if (string.IsNullOrEmpty(role))
                    return Unauthorized("Invalid token or role not found.");

                string query;

                if (role == "Admin")
                {
                    query = @"
                        SELECT p.*, s.UserId, u.UserName,u.Email, f.Title AS FormTitle
                        FROM Payments p
                        JOIN Submissions s ON p.SubmissionId = s.SubmissionId
                        JOIN Users u ON s.UserId = u.UserId
                        JOIN Forms f ON s.FormId = f.FormId
                        ORDER BY p.PaymentDate DESC";
                }
                else
                {
                    if (string.IsNullOrEmpty(userIdClaim))
                        return Unauthorized("UserId missing in token.");

                    query = $@"
                        SELECT p.*, s.UserId, u.UserName,u.Email, f.Title AS FormTitle
                        FROM Payments p
                        JOIN Submissions s ON p.SubmissionId = s.SubmissionId
                        JOIN Users u ON s.UserId = u.UserId
                        JOIN Forms f ON s.FormId = f.FormId
                        WHERE s.UserId = {userIdClaim}
                        ORDER BY p.PaymentDate DESC";
                }

                var dt = _db.ExecuteQuery(query);
                if (dt.Rows.Count == 0)
                    return Ok(new List<PaymentsModel>());

                var list = new List<object>();
                foreach (DataRow row in dt.Rows)
                {
                    list.Add(new
                    {
                        PaymentId = Convert.ToInt32(row["PaymentId"]),
                        SubmissionId = Convert.ToInt32(row["SubmissionId"]),
                        UserId = Convert.ToInt32(row["UserId"]),
                        UserName = row["UserName"].ToString(),
                        Email = row["Email"].ToString(),
                        FormTitle = row["FormTitle"].ToString(),
                        PaymentGateway = row["PaymentGateway"].ToString(),
                        TransactionId = row["TransactionId"].ToString(),
                        PaymentMethod = row["PaymentMethod"].ToString(),
                        Amount = Convert.ToDecimal(row["Amount"]),
                        Status = row["Status"].ToString(),
                        ReceiptUrl = row["ReceiptUrl"].ToString(),
                        PaymentDate = Convert.ToDateTime(row["PaymentDate"]).ToString("yyyy-MM-dd HH:mm:ss"),
                        UpdatedAt = row["UpdatedAt"] != DBNull.Value
                            ? Convert.ToDateTime(row["UpdatedAt"]).ToString("yyyy-MM-dd HH:mm:ss")
                            : null
                    });
                }

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePayment(int id)
        {
            try
            {
                string query = $"DELETE FROM Payments WHERE PaymentId = {id}";
                int rows = _db.ExecuteNonQuery(query);

                if (rows == 0)
                    return NotFound("Payment not found");

                return StatusCode(StatusCodes.Status200OK,  new { message = "Payment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


      
    }

}

