const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    issuer: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },

    // PDF template info
    templatePdf: {
      fileName: String,
      filePath: String,
      fileSize: Number,
    },

    // QR placement
    qrCoordinates: {
      x: Number,
      y: Number,
      page: {
        type: Number,
        default: 1,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
