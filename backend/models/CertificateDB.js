const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: String,
    batchId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "ISSUED", "FAILED"],
      default: "PENDING",
    },
    pdfPath: String,
    error: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", CertificateSchema);
