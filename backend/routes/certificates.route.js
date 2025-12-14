const express = require("express")
const router = express.Router();
const archiver = require("archiver");
const fs = require("fs");
const Certificate = require("../models/CertificateDB")

router.get("/status/:batchId", async (req, res) => {
  try {
    const certs = await Certificate.find({
      batchId: req.params.batchId,
    });

    res.json({
      success: true,
      count: certs.length,
      data: certs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate status",
    });
  }
});

router.get("/download/:batchId", async (req, res) => {
  try {
    const certificates = await Certificate.find({
      batchId: req.params.batchId,
      status: "ISSUED",
    });

    if (!certificates.length) {
      return res.status(404).json({
        success: false,
        message: "No issued certificates available",
      });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificates-${req.params.batchId}.zip`
    );

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error(err);
      res.status(500).end();
    });

    archive.pipe(res);

    certificates.forEach((cert) => {
      if (fs.existsSync(cert.pdfPath)) {
        archive.file(cert.pdfPath, {
          name: `${cert._id}.pdf`,
        });
      }
    });

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to generate ZIP",
    });
  }
});


module.exports = router