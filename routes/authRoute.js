const express = require("express");
const { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updateUser, blockAUser, unblockAUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token" , forgotPasswordToken);

router.put("/reset-password/:token" , resetPassword);
router.put("/order/update-order/:id", authMiddleware, updateOrderStatus);
router.put("/password", authMiddleware, isAdmin, updatePassword);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/all-users", getAllUser);
router.get("/get-order", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getAUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteAUser);

router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockAUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser );
router.get("/refresh", handleRefreshToken );

module.exports = router;