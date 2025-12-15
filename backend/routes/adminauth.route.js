const express = require("express")
const router = express.Router()

const jwt = require("jsonwebtoken")
router.get("/", async (req, res) => {
    const token = req.cookies.admintoken
    if (!token) {
        return res.status(401).json({authenticated:false})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json({
          authenticated: true,
          admin: decoded,
        });
    } catch (e) {
        res.status(500).json({ authenticated: false }); 
    }
})
module.exports = router