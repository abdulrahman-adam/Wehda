
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Make sure to import your User model

//the funcrtion Seller Login
export const sellerLogin = async(req, res) => {
  try {
      // Getting the email and password from req.body
    const {email, password} =req.body;
    // Cheacking if the email and password has role Seller
    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
        // genrate the token
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'})
        // send the to token to kookie
         res.cookie('sellerToken', token, {
            httpOnly: true, // Prevent Javascript to access cookie
            secure:process.env.NODE_ENV === 'production', // Use secure cookie in production
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        });
        // send the cookie to response
        return res.json({success: true, message: "Logged In"}); 
    } else {
        // Cheaking if the password and email not matching with seller credentials
        res.json({success: false, message: "Invalid Credentials"});
    }
  } catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
  }
}


// the function Cheack Seller is Auth
export const isSellerAuth = async(req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}

// export const getSellerProfile = async (req, res) => {
//     try {
//         // Return the credentials from your .env file
//         return res.json({
//             success: true,
//             seller: {
//                 name: "Administrateur", 
//                 email: process.env.SELLER_EMAIL
//             }
//         });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };





export const getSellerProfile = async (req, res) => {
    try {
        const adminEmail = process.env.SELLER_EMAIL;

        // Find the user in the database by email
        const adminUser = await User.findOne({ 
            where: { email: adminEmail },
            attributes: ['name', 'email', 'role'] // Only get necessary fields
        });

        if (!adminUser) {
            return res.json({ 
                success: false, 
                message: "Admin user not found in database" 
            });
        }

        return res.json({
            success: true,
            seller: {
                name: adminUser.name, // This will now be "Wehda Paris"
                email: adminUser.email
            }
        });
    } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// The function seller logout
export const sellerLogout = async (req, res) => {
    try {
        // On clear the cookie 
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure:process.env.NODE_ENV === 'production', 
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
        });
        return res.json({success: true, message: "You Are Logged Out"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}
