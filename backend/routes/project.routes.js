const express = require("express");
const Project = require("../models/ProjectDB");
const uploadTemplate = require("../middleware/uploadTemplate");

const router = express.Router();


/**
 * POST /api/projects
 * Create new project with template PDF & QR coordinates
 */
router.post("/", uploadTemplate.single("templatePdf"), async (req, res) => {
  try {
    const { projectName, description, issuer, issueDate, qrCoordinates } =
      req.body;

    const project = await Project.create({
      projectName,
      description,
      issuer,
      issueDate,
      templatePdf: req.file
        ? {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
          }
        : null,
      qrCoordinates: qrCoordinates ? JSON.parse(qrCoordinates) : null,
      createdBy: req.user?.id, // optional auth
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * GET /api/projects/:id
 * Fetch project + QR coordinates
 */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
  router.get("/allcertificates", async (req, res) => {
    const allcertificates = await Project.find();
    if (allcertificates) {
      res.status(200).json(allcertificates)
    }
  })
});


module.exports = router;

