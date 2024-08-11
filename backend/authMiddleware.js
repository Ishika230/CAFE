// middleware/authMiddleware.js
const isAdmin = (req, res, next) => {
    console.log(req.user.email);
    if (req.isAuthenticated() && req.user.role === 'admin') {
        console.log("granted");
        return next();
    }
    else {
        console.log(req.user.role);
        res.status(403).json({ message: 'Forbidden' });
    }
};

module.exports = { isAdmin };
