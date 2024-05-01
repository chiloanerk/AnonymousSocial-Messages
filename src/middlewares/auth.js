const jwt = require("jsonwebtoken")
const User = require("../models/User");

const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({error: "No token provided"});
    }
    const token = authorization.split(" ")[1];
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({_id}).select('_id username uniqueLink');
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: 'Request not authorized'});
    }
}

module.exports = auth;