const bcrypt = require('bcryptjs');
const { Admin, Form, User, Gender, ProgrammingLanguage } = require('../models');
const { generateToken } = require('../utils/jwt');

class AdminService {
    async login(loginData) {
        const { email, password } = loginData;

        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            throw new Error('Неверный email или пароль');
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            throw new Error('Неверный email или пароль');
        }

        const token = generateToken({
            id: admin.id,
            email: admin.email,
            type: 'admin'
        });

        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email
            }
        };
    }

    async getAllForms(page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Form.findAndCountAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email']
                },
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
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        return {
            forms: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        };
    }

    async getFormById(formId) {
        const form = await Form.findByPk(formId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email']
                },
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
            ]
        });

        if (!form) {
            throw new Error('Анкета не найдена');
        }

        return form;
    }

    async updateForm(formId, updateData) {
        const form = await Form.findByPk(formId);
        if (!form) {
            throw new Error('Анкета не найдена');
        }

        await form.update(updateData);
        return await this.getFormById(formId);
    }

    async deleteForm(formId) {
        const form = await Form.findByPk(formId);
        if (!form) {
            throw new Error('Анкета не найдена');
        }

        await form.destroy();
        return { message: 'Анкета удалена' };
    }

    async getAllUsers(page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const totalCount = await User.count();

        const users = await User.findAll({
            attributes: ['id', 'email', 'created_at'],
            include: [{
                model: Form,
                as: 'forms',
                attributes: ['id', 'first_name', 'last_name', 'created_at'],
                include: [
                    {
                        model: Gender,
                        as: 'gender',
                        attributes: ['name']
                    }
                ]
            }],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        return {
            users: users,
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit)
        };
    }
}

module.exports = new AdminService();