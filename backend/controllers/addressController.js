import Address from "../models/Address.js";


// The function add address
export const addAddress = async (req, res) => {
    try {
        // Getting the address data and userId from the body
        const {address, userId} = req.body;
        // add the address to database
        await Address.create({...address, userId});
        //Send the address to response
        res.json({success: true, message: "Your address has been added successfully"});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message: error.message});
    }
}

// The function fetching all addresses
export const getAddresses = async (req, res) => {
    try {
        const { userId } = req.body;

        // In Sequelize, use findAll instead of find
        const addresses = await Address.findAll({ 
            where: { userId: userId } 
        });

        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}