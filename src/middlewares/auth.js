const jwt = require("jsonwebtoken")

const authenticateToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({error: "No token provided"});
    }
    const token = authorization.split(" ")[1];
    try {
        const { _id, encryptedPrivateKey } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id, encryptedPrivateKey };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: 'Request not authorized'});
    }
}

module.exports = authenticateToken();