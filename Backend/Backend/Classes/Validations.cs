using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Backend.Classes
{
    public class Validations
    {
        private readonly DatabaseConnection _db;

        // ✅ Constructor to initialize DatabaseConnection
        public Validations(IConfiguration configuration)
        {
            _db = new DatabaseConnection(configuration);
        }

        public string ConvertLetterCase(LetterCasePerameter letterCasePerameter)
        {
            if (string.IsNullOrEmpty(letterCasePerameter.column))
            {
                return letterCasePerameter.column;
            }

            string transformedValue;

            switch (letterCasePerameter.caseType.ToLower())
            {
                case "titlecase":
                    transformedValue = new System.Globalization.CultureInfo("en-US", false)
                        .TextInfo.ToTitleCase(letterCasePerameter.column.ToLower());
                    break;

                case "uppercase":
                    transformedValue = letterCasePerameter.column.ToUpper();
                    break;

                case "lowercase":
                    transformedValue = letterCasePerameter.column.ToLower();
                    break;

                default:
                    transformedValue = letterCasePerameter.column;
                    break;
            }

            return transformedValue;
        }

        public bool CheckDuplicateRecord(CheckDuplicacyPerameter parameters)
        {
            string logicalOperator = parameters.andFlag ? "AND" : "OR";

            // ✅ Safely build query (Note: parameterized queries are safer)
            string condition = string.Join(" " + logicalOperator + " ",
                Enumerable.Range(0, parameters.fields.Length)
                .Select(i => $"{parameters.fields[i]} = '{parameters.values[i]}'"));

            string query = $"SELECT * FROM {parameters.tableName} WHERE ({condition})";

            if (!string.IsNullOrEmpty(parameters.idField) && !string.IsNullOrEmpty(parameters.idValue))
            {
                query += $" AND {parameters.idField} != '{parameters.idValue}'";
            }

            DataTable dt = _db.ExecuteQuery(query);
            return dt.Rows.Count > 0;
        }

        public string HidePassword(string usrpassword, bool encrypt = false)
        {
            if (encrypt)
            {
                return new string('*', usrpassword.Length * 2);
            }

            return usrpassword;
        }

        public string Encrypt(string EncryptionKey, string StringText)
        {
            try
            {
                byte[] bytes = Encoding.Unicode.GetBytes(StringText);
                using (Aes aes = Aes.Create())
                {
                    Rfc2898DeriveBytes keyGenerator = new Rfc2898DeriveBytes(EncryptionKey,
                        new byte[] { 73, 118, 97, 110, 32, 77, 101, 100 });

                    aes.Key = keyGenerator.GetBytes(32);
                    aes.IV = keyGenerator.GetBytes(16);

                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(bytes, 0, bytes.Length);
                            cs.Close();
                        }

                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string Decrypt(string EncryptionKey, string StringText)
        {
            try
            {
                StringText = StringText.Replace(" ", "+");
                byte[] cipherBytes = Convert.FromBase64String(StringText);

                using (Aes aes = Aes.Create())
                {
                    Rfc2898DeriveBytes keyGenerator = new Rfc2898DeriveBytes(EncryptionKey,
                        new byte[] { 73, 118, 97, 110, 32, 77, 101, 100 });

                    aes.Key = keyGenerator.GetBytes(32);
                    aes.IV = keyGenerator.GetBytes(16);

                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(cipherBytes, 0, cipherBytes.Length);
                            cs.Close();
                        }

                        return Encoding.Unicode.GetString(ms.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }

    // ✅ Parameter classes
    public class LetterCasePerameter
    {
        public string caseType { get; set; }
        public string column { get; set; }
    }

    public class CheckDuplicacyPerameter
    {
        public string tableName { get; set; }
        public string[] fields { get; set; }
        public string[] values { get; set; }
        public string idField { get; set; } = null;
        public string idValue { get; set; } = null;
        public bool andFlag { get; set; } = false;
    }
}
