const { verifyToken, extractToken } = require('../utils/jwt');
const { User, Admin } = require('../models');

async function authenticateUser(req, res, next) {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            type: 'user'
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Токен истек' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Недействительный токен' });
        }

        console.error('Ошибка аутентификации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}

async function authenticateAdmin(req, res, next) {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const decoded = verifyToken(token);

        if (decoded.type !== 'admin') {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }

        const admin = await Admin.findByPk(decoded.id);
        if (!admin) {
            return res.status(401).json({ error: 'Администратор не найден' });
        }

        req.admin = {
            id: admin.id,
            email: admin.email,
            type: 'admin'
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Токен истек' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Недействительный токен' });
        }

        console.error('Ошибка аутентификации админа:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}

module.exports = {
    authenticateUser,
    authenticateAdmin
};