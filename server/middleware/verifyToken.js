import errorHandler from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try{
        const token = req.cookies.access_token;
        if(!token) return next(errorHandler(401, "Unauthorized"));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;
        next();
    }catch(error){
        next(error);
    }
}

export default verifyToken;