const UserModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { isValid, isValidName, isValidEmail, isValidContact, isValidPassword, isValidObjectId } = require("../utils/validator")



//SignUp User
const signUp = async (req, res) => {
    try {
        let userData = req.body;

        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ msg: "Bad Request! No Data Provided" })
        }

        let { fullName, email, password, phone, bio, role } = userData

        //Name Validation
        if (!isValid(fullName)) {
            return res.status(400).json({ msg: " Name is required" })
        }
        if (!isValidName(fullName)) {
            return res.status(400).json({ msg: "Invalid Name" })
        }

        //Email Validation
        if (!isValid(email)) {
            return res.status(400).json({ msg: "Email is required" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ msg: "Invalid Email" })
        }
        let emailExist = await UserModel.findOne({ email })

        if (emailExist) {
            return res.status(400).json({ msg: "Email already exist" })
        }

        //Password Validation
        if (!isValid(password)) {
            return res.status(400).json({ msg: " Password is required" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ msg: "Invalid Password" })
        }

        //Phone Validation
        if (!isValid(phone)) {
            return res.status(400).json({ msg: "Contact number is required" })
        }
        if (!isValidContact(phone)) {
            return res.status(400).json({ msg: "Invalid contact number" })
        }
        let phoneExist = await UserModel.findOne({ phone })
        if (phoneExist) {
            return res.status(400).json({ msg: "Contact number already registered" })
        }

        //Bio Validation
        if (bio !== undefined) {
            if (bio.trim().length > 200) {
                return res.status(400).json({ msg: "Bio should not exceed 200 characters" })
            }
        }

        //Role Validation 
        if (role !== undefined) {
            if (role !== "user") {
                return res.status(400).json({ msg: "Invalid Role" })
            }
        }

        //Password Hashing
        let hashedPassword = await bcrypt.hash(password, 10)
        userData.password = hashedPassword

        let addedUser = await UserModel.create(userData)

        return res.status(201).json({ msg: "Sign up Successfull", addedUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

// Login User
const logIn = async (req, res) => {
    try {
        let data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ msg: "Bad Request! No Data Provided" });
        }

        const { email, password } = data;

        if (!isValid(email)) {
            return res.status(400).json({ msg: "Email is Required" });
        }

        if (!isValid(password)) {
            return res.status(400).json({ msg: "Password is Required" });
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }

        let passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ msg: "Incorrect Password" });
        }

        let token = jwt.sign(
            {
                userId: user._id,
                userRole: user.role,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d",
            },
        );

        return res.status(200).json({ msg: "Login Successfull", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Get Profile
const getProfile = async (req, res) => {
    try {
        let userId = req.userId;

        let user = await UserModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }

        return res.status(200).json({ msg: "Profile Fetched Successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        let userId = req.userId;

        let userData = req.body;

        if (!userData || Object.keys(userData).length === 0) {
            return res
                .status(400)
                .json({ msg: "Bad Request! Enter Data to Update." });
        }

        let { fullName, email, password, phone, bio } = userData;

        if (fullName !== undefined) {
            if (!isValid(fullName)) {
                return res.status(400).json({ msg: "Full Name is Required" });
            }

            if (fullName.length < 2 || !isValidFullName(fullName)) {
                return res.status(400).json({ msg: "Invalid Full Name" });
            }
        }

        if (email !== undefined) {
            if (!isValid(email)) {
                return res.status(400).json({ msg: "Email is Required" });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({ msg: "Invalid Email" });
            }

            let duplicateEmail = await UserModel.findOne({ email, $ne: userId });
            if (duplicateEmail) {
                return res.status(400).json({ msg: "Email Already Exists" });
            }
        }

        if (password !== undefined) {
            if (!isValid(password)) {
                return res.status(400).json({ msg: "Password is Required" });
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({ msg: "Invalid Password" });
            }
            let hashedPassword = await bcrypt.hash(password, 10);
            userData.password = hashedPassword;
        }

        if (phone !== undefined) {
            if (!isValid(phone)) {
                return res.status(400).json({ msg: "Phone Number is Required" });
            }

            if (!isValidPhone(phone)) {
                return res.status(400).json({ msg: "Invalid Phone Number" });
            }

            let duplicatePhoneNo = await UserModel.findOne({ phone, $ne: userId });
            if (duplicatePhoneNo) {
                return res.status(400).json({ msg: "Phone Number Already Exists" });
            }
        }

        if (bio !== undefined) {
            if (bio.trim().length > 200) {
                return res
                    .status(400)
                    .json({ msg: "Bio Should not exceed 200 Characters." });
            }
        }

        let updatedUserProfile = await UserModel.findByIdAndUpdate(
            userId,
            userData,
            { new: true },
        );

        return res
            .status(200)
            .json({ msg: "Profile Updated Successfully", updatedUserProfile });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

//Delete User
const deleteUser = async (req, res) => {
    try {
        let userId = req.userId
        let deletedUser = await UserModel.findByIdAndDelete(userId)
        if (!deletedUser) {
            return res.status(404).json({ msg: "User not found or Deleted successfully" })
        }

        return res.status(200).json({ msg: "Profile Deleted Successfully", deletedUser })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });

    }
}

//Get All User (Admin)
const getAllUser = async (req, res) => {
    try {
        let userId = req.userId;

        let user = await UserModel.find().select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }

        return res.status(200).json({ msg: "Profile Fetched Successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

// Delete User (Admin)
const deleteAllUser = async (req, res) => {
    try {
        let userId = req.params.id;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ msg: "Invalid Id" });
        }

        let user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ msg: "Admin Cannot be deleted" });
        }

        await UserModel.findByIdAndDelete(userId);
        return res.status(200).json({ msg: "User Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = { signUp, logIn, getProfile, updateProfile, getAllUser, deleteUser, deleteAllUser }