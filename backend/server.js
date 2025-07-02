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
        origin: "https://expensetracker-frontend-zod5.onrender.com",
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));