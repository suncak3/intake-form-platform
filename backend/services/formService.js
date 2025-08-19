const { Form, User, Gender, ProgrammingLanguage } = require('../models');

class FormService {
    async createForm(formData, userId) {
        if (!userId) {
            throw new Error('Пользователь не авторизован');
        }

        const existingFormByIIN = await Form.findOne({
            where: { iin: formData.iin }
        });
        if (existingFormByIIN) {
            throw new Error('Анкета с таким ИИН уже существует');
        }

        const existingFormByPhone = await Form.findOne({
            where: { phone: formData.phone }
        });
        if (existingFormByPhone) {
            throw new Error('Анкета с таким телефоном уже существует');
        }

        const gender = await Gender.findByPk(formData.gender_id);
        if (!gender) {
            throw new Error('Указанный пол не найден');
        }

        if (formData.programming_language_id) {
            const language = await ProgrammingLanguage.findByPk(formData.programming_language_id);
            if (!language) {
                throw new Error('Указанный язык программирования не найден');
            }
        }

        const form = await Form.create({
            ...formData,
            user_id: userId
        });

        return await this.getFormById(form.id);
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

    async updateForm(formId, updateData, userId) {
        const whereCondition = { id: formId };
        if (userId) {
            whereCondition.user_id = userId;
        }

        const form = await Form.findOne({ where: whereCondition });
        if (!form) {
            throw new Error('Анкета не найдена или у вас нет прав на её изменение');
        }

        if (updateData.iin && updateData.iin !== form.iin) {
            const existingForm = await Form.findOne({
                where: {
                    iin: updateData.iin,
                    id: { [require('sequelize').Op.ne]: formId }
                }
            });
            if (existingForm) {
                throw new Error('Анкета с таким ИИН уже существует');
            }
        }

        if (updateData.phone && updateData.phone !== form.phone) {
            const existingForm = await Form.findOne({
                where: {
                    phone: updateData.phone,
                    id: { [require('sequelize').Op.ne]: formId }
                }
            });
            if (existingForm) {
                throw new Error('Анкета с таким телефоном уже существует');
            }
        }

        if (updateData.gender_id) {
            const gender = await Gender.findByPk(updateData.gender_id);
            if (!gender) {
                throw new Error('Указанный пол не найден');
            }
        }

        if (updateData.programming_language_id) {
            const language = await ProgrammingLanguage.findByPk(updateData.programming_language_id);
            if (!language) {
                throw new Error('Указанный язык программирования не найден');
            }
        }

        await form.update(updateData);
        return await this.getFormById(formId);
    }

    async deleteForm(formId, userId) {
        const whereCondition = { id: formId };
        if (userId) {
            whereCondition.user_id = userId;
        }

        const form = await Form.findOne({ where: whereCondition });
        if (!form) {
            throw new Error('Анкета не найдена или у вас нет прав на её удаление');
        }

        await form.destroy();
        return { message: 'Анкета удалена' };
    }
}

module.exports = new FormService();