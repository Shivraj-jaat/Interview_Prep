const express = require("express");
const router = express.Router();

const { signUp, logIn, getProfile, updateProfile, getAllUser, deleteUser, deleteAllUser } = require("../controllers/userController");
const { authentication, authorization } = require("../middlewares/auth");



router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/profile", authentication, getProfile);
router.put("/update", authentication, updateProfile);
router.delete("/delete", authentication, deleteUser)

//Admin Routes
router.get("/getAll", authentication, authorization, getAllUser)
router.delete("/deleteAll/:id", authentication, authorization, deleteAllUser)

module.exports = router;
