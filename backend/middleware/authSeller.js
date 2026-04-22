


import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = req.cookies;

        // Si pas de token, on renvoie success: false MAIS sans message d'erreur agressif
        if (!sellerToken) {
            return res.json({ success: false }); 
        }

        const token_decode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
        req.body.sellerId = token_decode.id; 
        next();
    } catch (error) {
        // En cas d'erreur de jeton (expiré, etc.), on reste discret
        res.json({ success: false });
    }
};

export default authSeller;