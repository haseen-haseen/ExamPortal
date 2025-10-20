using Microsoft.Data.SqlClient;
using System.Data;

namespace Backend.Classes
{
    public class DatabaseConnection
    {
        private string _connectionString;

        private SqlConnection _connection;

        public DatabaseConnection(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("dbcs");
            _connection = new SqlConnection(_connectionString);
        }

        public DataTable ExecuteQuery(string query)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, connection))
                {
                    try
                    {
                        if (connection.State != ConnectionState.Open)
                        {
                            connection.Open();
                        }


                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);

                    }
                    using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);
                        return dt;
                    }

                }
            }


        }

        public int ExecuteNonQuery(string query)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (var cmd = new SqlCommand(query, connection))
                {
                    connection.Open();
                    return cmd.ExecuteNonQuery();
                }
            }
        }
        public object ExecuteScalar(string query)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                conn.Open();
                return cmd.ExecuteScalar();
            }
        }

    }
}
