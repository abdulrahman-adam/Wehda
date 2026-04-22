import Category from "../models/Category.js";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Products.js";

export const addProduct = async (req, res) => {
    try {
        // 1. Extract fields - Use categoryId to link to the tree
        const { 
            name, 
            description, 
            categoryId, 
            price, 
            offerPrice, 
            variants, 
            colors, 
            availability 
        } = req.body;
        
        const files = req.files; 

        // 2. Validation
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        if (!categoryId) {
            return res.status(400).json({ success: false, message: "A category selection is required" });
        }

        // 3. Upload multiple images to Cloudinary
        const imagesUrl = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, { 
                resource_type: 'image',
                folder: 'products'
            });
            imagesUrl.push(result.secure_url);
        }

        // 4. Helper function for safe JSON parsing 
        // (Useful if your frontend sends JSON as strings in FormData)
        const safeParse = (data) => {
            if (typeof data === 'string') {
                try { return JSON.parse(data); } 
                catch (e) { return data; }
            }
            return data;
        };

        // 5. Save to Database using the model's new schema
        const product = await Product.create({
            name,
            description: safeParse(description),
            price: Number(price),
            offerPrice: Number(offerPrice),
            image: imagesUrl, // Saved as JSON array
            variants: safeParse(variants),
            colors: safeParse(colors),
            availability: Number(availability) || 0,
            categoryId: categoryId, // This links it to the specific Category/Subcategory
        });

        return res.status(201).json({ 
            success: true, 
            message: "The product has been added successfully",
            product 
        });

    } catch (error) {
        console.error("Add Product Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


export const productList = async (req, res) => {
    try {
        // 1. Fetch all products and include their category lineage
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'categoryData',
                    attributes: ['id', 'text', 'path'], // Only get what we need
                    include: [
                        {
                            model: Category,
                            as: 'parent',
                            attributes: ['id', 'text'] // Get the parent for the tree view
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']] // Show newest products first
        });

        // 2. Note: We don't need manual JSON.parse() here because 
        // the Model Getters already handle image, variants, and description.
        const safeProducts = products.map((p) => {
    const product = p.toJSON();

    return {
        ...product,

        // FIX NULL SAFETY
        image: product.image || [],
        variants: product.variants || [],
        colors: product.colors || [],
        availability: product.availability ?? 0,

        // CATEGORY SAFETY
        categoryData: product.categoryData
            ? {
                ...product.categoryData,
                parent: product.categoryData.parent || null
              }
            : null
    };
});
        
        return res.json({ 
            success: true, 
            count: products.length,
            products 
        });

    } catch (error) {
        console.error("Product List Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to fetch products",
            error: error.message 
        });
    }
};

export const productById = async (req, res) => {
    try {
        const { id } = req.body;

        // Fetch product and include the full category path (The Tree)
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'categoryData',
                    // This "parent" chain allows the frontend to build breadcrumbs
                    include: [
                        {
                            model: Category,
                            as: 'parent', 
                            include: [
                                {
                                    model: Category,
                                    as: 'parent' // Goes up to 3 levels: Child -> Parent -> Grandparent
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Note: No manual JSON.parse needed here! 
        // Sequelize Model Getters handle image arrays, variants, and description automatically.

        return res.json({ 
            success: true, 
            product 
        });

    } catch (error) {
        console.error("Error in productById:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

export const changeStock = async (req, res) => {
    try {
        const { id, inStock, availability } = req.body;

        // 1. Check if the product exists first
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // 2. Prepare update data
        // We use the logical OR (||) to keep existing values if new ones aren't provided
        const updateData = {
            inStock: typeof inStock === 'boolean' ? inStock : product.inStock,
            availability: availability !== undefined ? Number(availability) : product.availability
        };

        // 3. Logic Sync: If availability is 0, automatically set inStock to false
        if (updateData.availability <= 0) {
            updateData.inStock = false;
        }

        // 4. Perform the update
        await product.update(updateData);

        return res.json({ 
            success: true, 
            message: "Stock status updated successfully",
            data: {
                inStock: updateData.inStock,
                availability: updateData.availability
            }
        });

    } catch (error) {
        console.error("Change Stock Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to update stock",
            error: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        // 1. Find the product
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // 2. Cleanup Cloudinary Images
        // product.image is automatically an array thanks to the Model Getter
        if (Array.isArray(product.image) && product.image.length > 0) {
            
            // Map the URLs to public IDs and delete them all at once
            const deletionPromises = product.image.map(url => {
                if (typeof url === 'string' && url.includes('/')) {
                    // Extracts the public_id between the last '/' and the file extension
                    const publicId = url.split("/").pop().split(".")[0];
                    
                    // Optional: If you use folders (e.g., 'products/image_name'), 
                    // ensure your split logic accounts for that or store publicId in DB.
                    return cloudinary.uploader.destroy(`products/${publicId}`);
                }
                return Promise.resolve(); // Skip invalid URLs
            });

            await Promise.all(deletionPromises);
        }

        // 3. Delete from Database
        await product.destroy();

        return res.json({ 
            success: true, 
            message: "Product and associated images deleted successfully" 
        });

    } catch (error) {
        console.error("Delete Product Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};