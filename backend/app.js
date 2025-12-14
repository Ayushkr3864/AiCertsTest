const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = require("./routes/project.routes");
const home = require("./routes/home.route")
const batch = require("./routes/uploadZip.route")
const certificate = require("./routes/certificates.route")
const dashboard = require("./routes/dashboard.route")

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/",home)
app.use("/api/projects", projectRoutes);
app.use("/api/batch/validate", batch);
app.use("/certificate", certificate)
app.use("/dashboard",dashboard)



mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});
app.listen(3000)
module.exports = app;
