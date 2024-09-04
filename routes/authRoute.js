const express = require("express");
const { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser } = require("../controller/userController");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUser);
router.get("/:id", getAUser);
router.delete("/:id", deleteAUser);

module.exports = router;