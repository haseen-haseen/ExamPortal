🧾 Exam Form & Payment Portal – Fullstack

A full-stack web application that allows users to register, log in, fill exam forms, and make secure payments online. The system includes separate User and Admin portals with role-based authentication, dashboard analytics, and PDF receipt generation.


⚙️ Setup Instructions
🖥️ 1. Clone the Repository
git clone https://github.com/haseen-haseen/ExamPortal.git
cd ExamPortal

🗄️ 2. Restore the Database

Open SQL Server Management Studio (SSMS).

Right-click on the Databases folder → click Restore Database.

Select Device → click the … (browse) button.

Click Add → navigate to:

ExamPortal/database-files/ExamPortalDB.bak


Click OK to restore.

Verify that tables (users, forms, submissions, payments) are visible.

⚙️ 3. Update the Connection String

Before running the backend, update your server name in the connection string:

Open this file in your backend project:

backend/appsettings.json


Find the "ConnectionStrings" section and modify it to match your local SQL Server instance:

"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ExamPortalDB;Trusted_Connection=True;TrustServerCertificate=True;"
}


Example:

"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-1234\\SQLEXPRESS;Database=ExamPortalDB;Trusted_Connection=True;TrustServerCertificate=True;"
}


Save the file.

🧩 4. Run the Backend (ASP.NET Core)

Open Visual Studio 2022.

Open the solution file:

backend/backend.sln


Set the project to run with HTTPS profile.

Click Run ▶️.

Swagger UI should open automatically with available API endpoints at:

https://localhost:<port>/swagger

🌐 5. Run the Frontend (Vue.js / React)

Open a terminal inside the frontend folder:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


The frontend should now be available at:

http://localhost:5173


(or as shown in your terminal output)

🔑 Login Credentials (Sample)
Role	     Email	                      Password
Admin	    admin@gmail.com               admin
User	    user@gmail.com                user

(Note.... Role will be fetched from the token)