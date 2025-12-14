require("dotenv").config();

module.exports = {
  MAX_CERT_LIMIT: process.env.MAX_CERT_LIMIT || 250,
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads/batches",
  BATCH_SIZE: 50,
};
