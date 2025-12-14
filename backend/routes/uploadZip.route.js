const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadZip");
const Batch = require('../models/BatchDB');
const { validateZip } = require("../services/batch.service");

router.post("/", upload.single("batchZip"), async (req, res) => {
  try {
    const result = validateZip(req.file.path);

    const batch = await Batch.create({
      ...result,
      filename: req.file.originalname,
      storedAt: req.file.path,
    });

    res.json({ success: true, batchId: batch._id, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
router.get("/", async (req, res) => {
  res.send("server is running");
});

module.exports = router;
