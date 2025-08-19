const bcrypt = require('bcryptjs');
const { User, Form, Gender, ProgrammingLanguage } = require('../models');
const { generateToken } = require('../utils/jwt');

class UserService {
    async register(userData) {
        const { email, password } = userData;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        const token = generateToken({
            id: user.id,
            email: user.email,
            type: 'user'
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    async login(loginData) {
        const { email, password } = loginData;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Неверный email или пароль');
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            type: 'user'
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    async getMyForms(userId) {
        const forms = await Form.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Gender,
                    as: 'gender',
                    attributes: ['id', 'name', 'code']
                },
                {
                    model: ProgrammingLanguage,
                    as: 'programming_language',
                    attributes: ['id', 'name', 'is_predefined']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return forms;
    }
}

module.exports = new UserService();