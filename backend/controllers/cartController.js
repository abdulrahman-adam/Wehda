

import User from "../models/User.js"

// The function Update User cartData
export const updateCart = async (req, res) => {
    try {
        // Getting the user Id and Cart Data from request body
        const { userId, cartItems } = req.body;

        // Validation: Sequelize will throw an error if userId is undefined in a WHERE clause
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        /**
         * MYSQL/SEQUELIZE VERSION
         * .update(values, options)
         */
        await User.update(
            { cartItems: cartItems }, // The columns to update
            { 
                where: { id: userId } // The condition (MySQL uses 'id' instead of '_id')
            }
        );

        // Generate the response
        res.json({ success: true, message: "Your cart has been updated" });
    } catch (error) {
        console.error("MySQL Update Error:", error.message);
        return res.json({ success: false, message: error.message });
    }
}