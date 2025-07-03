require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/strategies/google-login")(passport);

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.UI_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes)
app.use("/api/v1/dashboard", dashboardRoutes);

// server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve Vite build static files
app.use(express.static(path.join(__dirname, "../frontend/expenseApp/dist"))); // Adjust path if needed

// Handle React Router routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/expenseApp/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));