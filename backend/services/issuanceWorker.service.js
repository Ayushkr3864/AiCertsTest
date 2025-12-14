// services/issuer.service.js
const Certificate = require("../models/CertificateDB");
const fs = require("fs");
const path = require("path");

async function issueCertificates(batchId, io) {
  const certificates = await Certificate.find({ batchId });

  certificates.forEach((cert, index) => {
    setTimeout(async () => {
      try {
        await Certificate.findByIdAndUpdate(cert._id, {
          status: "IN_PROGRESS",
        });

        io.emit("certificate-update", {
          id: cert._id,
          status: "IN_PROGRESS",
        });

        // simulate pdf generation
        await new Promise((res) => setTimeout(res, 2000));

        await Certificate.findByIdAndUpdate(cert._id, {
          status: "ISSUED",
          issuedAt: new Date(),
        });

        io.emit("certificate-update", {
          id: cert._id,
          status: "ISSUED",
        });
      } catch (err) {
        await Certificate.findByIdAndUpdate(cert._id, {
          status: "FAILED",
        });

        io.emit("certificate-update", {
          id: cert._id,
          status: "FAILED",
        });
      }
    }, index * 3000); 
  });
}

module.exports = { issueCertificates };
