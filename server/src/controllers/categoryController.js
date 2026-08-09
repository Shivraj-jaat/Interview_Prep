const CategoryModel = require("../models/categoryModel");

const {
    isValid,
    isValidCategoryName,
    isValidObjectId,
} = require("../utils/validator");

// Add Category (Admin)
const addCategory = async (req, res) => {
    try {
        let categoryData = req.body;

        if (!categoryData || Object.keys(categoryData).length === 0) {
            return res.status(400).json({ msg: "Bad Request! No Data Provided" });
        }

        let { categoryName, description, status } = categoryData;

        // Category Name Validation
        if (!isValid(categoryName)) {
            return res.status(400).json({ msg: "Category Name is Required" });
        }

        if (!isValidCategoryName(categoryName)) {
            return res.status(400).json({ msg: "Invalid Category Name" });
        }

        let duplicateCategory = await CategoryModel.findOne({ categoryName });

        if (duplicateCategory) {
            return res.status(400).json({ msg: "Category Already Exists" });
        }

        // Description Validation
        if (!isValid(description)) {
            return res.status(400).json({ msg: "Descriptionis Required" });
        }

        if (description.length < 10 || description.length > 400) {
            return res.status(400).json({
                msg: "Description Should be less than 400 and greater than 10 Characters.",
            });
        }

        // Status Validation
        if (status !== undefined) {
            if (status !== "active" && status !== "inactive") {
                return res.status(400).json({ msg: "Invalid Status" });
            }
        }

        let category = await CategoryModel.create(categoryData);
        return res.status(200).json({ msg: "Category Added Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Get All Category
const getAllCategory = async (req, res) => {
    try {
        let userId = req.userId;

        let categoryData = await CategoryModel.find();

        if (!categoryData) {
            return res.status(404).json({ msg: "Categories not found" })
        }
        return res.status(200).json({ categoryData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Get Category By Id
const getCategoryById = async (req, res) => {
    try {
        let categoryId = req.params.id

        if (!isValidObjectId(categoryId)) {
            return res.status(400).json({ msg: "Invalid Category Id" })
        }

        let categoryData = await CategoryModel.findById(categoryId)

        if (!categoryData) {
            return res.status(404).json({ msg: "Category not found" })
        }

        return res.status(200).json({ msg: "Category Fetched Successfully", categoryData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Update Category(Admin)
const updateCategory = async (req, res) => {
    try {
        let categoryId = req.params.id
        let data = req.body

        if (!isValidObjectId(categoryId)) {
            return res.status(400).json({ msg: "Invalid Category Id" })
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ msg: "Bad Request ! No Data Provided" })
        }

        let { categoryName, description, status } = data

        // Category Name Validation

        if (categoryName !== undefined) {
            if (!isValid(categoryName)) {
                return res.status(400).json({ msg: "Category Name is Required" });
            }

            if (!isValidCategoryName(categoryName)) {
                return res.status(400).json({ msg: "Invalid Category Name" });
            }

            let duplicateCategory = await CategoryModel.findOne({ categoryName, _id: { $ne: categoryId } });

            if (duplicateCategory) {
                return res.status(400).json({ msg: "Category Already Exists" });
            }
        }

        // Description Validation
        if (description !== undefined) {
            if (!isValid(description)) {
                return res.status(400).json({ msg: "Description is Required" });
            }

            if (description.length < 10 || description.length > 400) {
                return res.status(400).json({
                    msg: "Description Should be less than 400 and greater than 10 Characters.",
                });
            }
        }

        // status
        if (status !== undefined) {
            if (status !== "active" && status !== "inactive") {
                return res.status(400).json({ msg: "Invalid Status" })
            }
        }

        let updatedData = await CategoryModel.findByIdAndUpdate(categoryId, data, { new: true })

        return res.status(200).json({ msg: "Category updated successfully", updatedData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

// Delete Category(Admin)
const deleteCategory = async (req, res) => {

    try {
        let categoryId = req.params.id

        if (!isValidObjectId(categoryId)) {
            return res.status(400).json({ msg: "Invalid Category Id" })
        }

        let deletedCategory = await CategoryModel.findByIdAndDelete(categoryId)

        if (!deletedCategory) {
            return res.status(404).json({ msg: "Category not found or already deleted" })
        }

        return res.status(200).json({ msg: "Category Deleted Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = {
    addCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
