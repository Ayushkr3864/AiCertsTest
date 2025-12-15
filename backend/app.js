const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/project.routes");
const cookieParser = require("cookie-parser")
const home = require("./routes/home.route")
const batch = require("./routes/uploadZip.route")
const certificate = require("./routes/certificates.route")
const dashboard = require("./routes/dashboard.route")
const adminLogin = require("./routes/adminLogin.route")
const auth = require("./routes/adminauth.route")

const path = require("path");
require("dotenv").config();
const cors = require("cors")

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ai-certs-test.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/",home)
app.use("/api/projects", projectRoutes);
app.use("/api/batch/validate", batch);
app.use("/certificate", certificate)
app.use("/dashboard", dashboard)
app.use("/admin/login",adminLogin)
app.use("/admin/auth",auth)


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});
app.listen(3000)
module.exports = app;
