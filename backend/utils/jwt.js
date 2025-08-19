const jwt = require('jsonwebtoken');

function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function extractToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // убираем "Bearer "
}

module.exports = {
    generateToken,
    verifyToken,
    extractToken
};