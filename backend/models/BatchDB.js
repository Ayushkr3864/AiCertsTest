const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema(
  {
    filename: String,
    total: Number,
    valid: Number,
    invalid: Number,
    errors: [String],
    status: {
      type: String,
      enum: ["VALIDATED", "FAILED", "PROCESSING", "COMPLETED"],
      default: "VALIDATED",
    },
    storedAt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", BatchSchema);
