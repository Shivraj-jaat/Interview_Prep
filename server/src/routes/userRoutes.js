const express = require("express");
const router = express.Router();

const { signUp, logIn, getProfile, updateProfile, getAllUser, deleteUser, deleteAllUser } = require("../controllers/userController");
const { authentication, authorization } = require("../middlewares/auth");

const upload = require("../config/multer");


router.post("/signup", upload.single("profileImage"), signUp);
router.post("/login", logIn);
router.get("/profile", authentication, getProfile);
router.put("/update", upload.single("profileImage"), authentication, updateProfile);
router.delete("/delete", authentication, deleteUser)

//Admin Routes
router.get("/getAll", authentication, authorization, getAllUser)
router.delete("/deleteAll/:id", authentication, authorization, deleteAllUser)

module.exports = router;
