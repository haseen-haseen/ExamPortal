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

Open the file:

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

https://localhost:<port>/swagger/index.html

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
Role	Email	Password
Admin	admin@gmail.com
	admin
User	user@gmail.com
	user

Note: Role will be fetched from the token.

🧾 PDF Receipt Generation

After a successful payment:

A downloadable PDF receipt is automatically generated.

The receipt includes:

User details

Form information

Payment ID

📊 Admin Features

Create, edit, and delete exam forms

View all user submissions and payments

Create, edit, and delete users

Change the status of submissions/payments to verify payments

Dashboard showing:

Total Users

Total Forms

Total Transactions

👥 User Features

Register / Login

View available exam forms

Apply for any exam by clicking the Apply Now button

Make online payments securely after submitting the exam

Download PDF receipts

🧰 API Documentation

Swagger automatically generates interactive API documentation.
Once the backend is running, visit:

https://localhost:7038/swagger/index.html

💳 Payment Gateway Setup

A dummy/fake Razorpay is used for testing.
Enter any fake UPI/payment info → it will show payment successful.
For real payments, add your Razorpay key in the frontend and test accordingly.


📘 Author

Name: Haseen
GitHub: haseen-haseen

Project: Exam Form & Payment Portal