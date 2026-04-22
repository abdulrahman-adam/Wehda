import { v2 as cloudinary } from "cloudinary";

import Category from "../models/Category.js";

// export const addCategory = async (req, res) => {
//   try {
//     const { text, path, bgColor, parentId } = req.body;

//     // 1. Validation: Image is required
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No image uploaded" });
//     }

//     // 2. Optional Hierarchy Check: If parentId is provided, verify it exists
//     if (parentId) {
//       const parentExists = await Category.findByPk(parentId);
//       if (!parentExists) {
//         return res.status(404).json({ success: false, message: "Parent category not found" });
//       }
//     }

//     // 3. Upload image to Cloudinary
//     // Tip: using folder naming in Cloudinary keeps your media tab organized
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "image",
//       folder: "categories", 
//     });

//     // 4. Save to database
//     const newCategory = await Category.create({
//       text,
//       path,
//       bgColor,
//       parentId: parentId || null, // If no parentId, it becomes a top-level category
//       image: result.secure_url,
//       imagePublicId: result.public_id,
//     });

//     return res.status(201).json({ 
//       success: true, 
//       message: "Category created successfully", 
//       data: newCategory 
//     });

//   } catch (error) {
//     console.error("Error in addCategory:", error);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Internal Server Error", 
//       error: error.message 
//     });
//   }
// };

export const addCategory = async (req, res) => {
  try {
    const { text, path, bgColor, parentId } = req.body;

    // ✅ Convert parentId safely
    const parsedParentId = parentId ? Number(parentId) : null;

    // 1. Validation: Image is required
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // 2. Check parent exists
    if (parsedParentId) {
      const parentExists = await Category.findByPk(parsedParentId);
      if (!parentExists) {
        return res.status(404).json({ success: false, message: "Parent category not found" });
      }
    }

    // 3. Upload image
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "categories",
    });

    // 4. Save to database
    const newCategory = await Category.create({
      text,
      path,
      bgColor,
      parentId: parsedParentId, // ✅ FIXED
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });

  } catch (error) {
    console.error("Error in addCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// export const categoryList = async (req, res) => {
//     try {
//         // Fetch only top-level categories (parentId is null)
//         // and include their children recursively
//         const categories = await Category.findAll({
//             where: {
//                 parentId: null
//             },
//             include: [
//                 {
//                     model: Category,
//                     as: 'subcategories',
//                     include: [
//                         {
//                             model: Category,
//                             as: 'subcategories' // This allows for 3 levels (Grandparent > Parent > Child)
//                         }
//                     ]
//                 }
//             ],
//             order: [['text', 'ASC']] // Optional: sorts categories alphabetically
//         });

//         return res.json({ 
//             success: true, 
//             count: categories.length, 
//             categories 
//         });
//     } catch (error) {
//         console.error("Error in categoryList:", error.message);
//         return res.status(500).json({ 
//             success: false, 
//             message: "Failed to retrieve category tree", 
//             error: error.message 
//         });
//     }
// };

export const categoryList = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parentId: null },
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    include: [
                        {
                            model: Category,
                            as: 'subcategories'
                        }
                    ]
                }
            ],
            order: [['text', 'ASC']]
        });

        // ===============================
        // ✅ ADDED: FLATTEN + ADD parentId
        // ===============================
        const flattenCategories = (cats, parentId = null) => {
            let result = [];

            cats.forEach((cat) => {
                // const plain = cat.toJSON();
                const plain = typeof cat.toJSON === "function" ? cat.toJSON() : cat;

                result.push({
                    ...plain,
                    parentId: parentId || null, // ✅ IMPORTANT
                });

                if (plain.subcategories?.length) {
                    result = result.concat(
                        flattenCategories(plain.subcategories, plain.id)
                    );
                }
            });

            return result;
        };

        const flatCategories = flattenCategories(categories);

        return res.json({
            success: true,
            count: flatCategories.length,
            categories: flatCategories // ✅ NOW FRONTEND WORKS
        });

    } catch (error) {
        console.error("Error in categoryList:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve category tree",
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;

    // 1. Find the category including its subcategories
    const category = await Category.findByPk(id, {
      include: { model: Category, as: 'subcategories' }
    });

    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: `Category ID ${id} not found` 
      });
    }

    // 2. Handle Cloudinary cleanup for the category and its children
    // We create an array of all public IDs to delete from Cloudinary
    const publicIdsToDelete = [];
    
    if (category.imagePublicId) publicIdsToDelete.push(category.imagePublicId);
    
    // Add subcategory images to the delete list
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach(sub => {
        if (sub.imagePublicId) publicIdsToDelete.push(sub.imagePublicId);
      });
    }

    // Execute Cloudinary deletions
    if (publicIdsToDelete.length > 0) {
      await Promise.all(
        publicIdsToDelete.map(publicId => cloudinary.uploader.destroy(publicId))
      );
    }

    // 3. Delete from Database
    // Because we set up the association with onDelete: 'CASCADE' in the model,
    // destroying the parent will automatically destroy children in MySQL.
    await category.destroy();

    return res.json({ 
      success: true, 
      message: "Category and its subcategories deleted successfully" 
    });

  } catch (error) {
    console.error("Delete Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};