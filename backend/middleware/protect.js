const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401);
        throw new Error("No token provided");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(403);
            throw new Error("Invalid token");
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = protect;