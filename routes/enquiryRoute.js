const express = require("express");
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquiry } = require("../controller/enquiryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createEnquiry);
router.get("/", getAllEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);

module.exports = router;