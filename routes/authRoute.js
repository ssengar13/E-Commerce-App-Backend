const express = require("express");
const { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateUser, blockAUser, unblockAUser, handleRefreshToken, logout } = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getAUser);
router.delete("/:id", deleteAUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockAUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser );
router.get("/refresh", handleRefreshToken );

module.exports = router;