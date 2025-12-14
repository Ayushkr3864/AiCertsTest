const express = require("express");
const ProjectDB = require("../models/ProjectDB");
const app = express.Router()

app.get("/", async (req, res) => {
  res.send("server is running");
});

let certificates = [
  {
    _id: "1",
    certificateId: "CERT-1001",
    status: "PENDING",
    pdfUrl: "/certificates/CERT-1001.pdf",
  },
  {
    _id: "2",
    certificateId: "CERT-1002",
    status: "FAILED",
    pdfUrl: "/certificates/CERT-1002.pdf",
  },
  {
    _id: "3",
    certificateId: "CERT-1003",
    status: "ISSUED",
    pdfUrl: "/certificates/CERT-1003.pdf",
  },
];

function simulateIssuance(cert) {
  cert.status = "IN_PROGRESS";

  setTimeout(() => {
    const success = Math.random() > 0.2; // 80% success
    cert.status = success ? "ISSUED" : "FAILED";
  }, 4000);
}

app.get("/api/certificates", async (req, res) => {
    const allcertificates = await ProjectDB.find()
    const pdfurl = allcertificates
    console.log(pdfurl);
    
  res.json({certificates,pdfurl});
});

app.post("/certificates/:id/retry", (req, res) => {
  const cert = certificates.find((c) => c._id === req.params.id);
  if (!cert) return res.status(404).json({ message: "Not found" });

  simulateIssuance(cert);
  res.json({ success: true, cert });
});

app.post("/api/certificates/:id/reissue", (req, res) => {
  const cert = certificates.find((c) => c._id === req.params.id);
  if (!cert) return res.status(404).json({ message: "Not found" });

  cert.status = "PENDING";
  simulateIssuance(cert);

  res.json({ success: true, cert });
});

app.get("/api/batch/progress", (req, res) => {
  const total = certificates.length;
  const issued = certificates.filter((c) => c.status === "ISSUED").length;
  const failed = certificates.filter((c) => c.status === "FAILED").length;
  const inProgress = certificates.filter(
    (c) => c.status === "IN_PROGRESS"
  ).length;

  res.json({
    total,
    issued,
    failed,
    inProgress,
    pending: total - issued - failed - inProgress,
  });
});

module.exports = app