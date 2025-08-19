const Joi = require('joi');

function validateIIN(iin) {
    if (!/^\d{12}$/.test(iin)) {
        return false;
    }

    const allSameDigits = /^(\d)\1{11}$/.test(iin);
    if (allSameDigits) {
        return false;
    }

    return true;
}

const schemas = {
    userRegister: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Некорректный формат email',
            'any.required': 'Email обязателен'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Пароль должен содержать минимум 6 символов',
            'any.required': 'Пароль обязателен'
        })
    }),

    userLogin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    createForm: Joi.object({
        first_name: Joi.string().min(1).max(50).required().messages({
            'any.required': 'Имя обязательно',
            'string.max': 'Имя не должно превышать 50 символов'
        }),
        last_name: Joi.string().min(1).max(50).required().messages({
            'any.required': 'Фамилия обязательна'
        }),
        middle_name: Joi.string().max(50).allow('', null),
        iin: Joi.string().length(12).pattern(/^\d+$/).custom((value, helpers) => {
            if (!validateIIN(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }).required().messages({
            'string.length': 'ИИН должен содержать ровно 12 цифр',
            'string.pattern.base': 'ИИН должен содержать только цифры',
            'any.invalid': 'ИИН не может состоять из одинаковых цифр',
            'any.required': 'ИИН обязателен'
        }),
        gender_id: Joi.number().integer().positive().required().messages({
            'number.base': 'ID пола должен быть числом',
            'number.positive': 'ID пола должен быть положительным',
            'any.required': 'Пол обязателен'
        }),
        birth_date: Joi.date().max('now').required().messages({
            'date.max': 'Дата рождения не может быть в будущем',
            'any.required': 'Дата рождения обязательна'
        }),
        phone: Joi.string().pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/).required().messages({
            'string.pattern.base': 'Телефон должен быть в формате +7 (XXX) XXX-XX-XX',
            'any.required': 'Телефон обязателен'
        }),
        programming_language_id: Joi.number().integer().positive().allow(null),
        custom_programming_language: Joi.string().max(100).allow('', null)
    }).custom((value, helpers) => {
        if (!value.programming_language_id && !value.custom_programming_language) {
            return value;
        }

        if (value.programming_language_id && value.custom_programming_language) {
            return helpers.error('custom.conflicting_language_fields');
        }

        return value;
    }).messages({
        'custom.conflicting_language_fields': 'Укажите либо ID языка программирования, либо свой вариант, но не оба одновременно'
    }),

    updateForm: Joi.object({
        first_name: Joi.string().min(1).max(50),
        last_name: Joi.string().min(1).max(50),
        middle_name: Joi.string().max(50).allow('', null),
        iin: Joi.string().length(12).pattern(/^\d+$/).custom((value, helpers) => {
            if (!validateIIN(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }).messages({
            'string.length': 'ИИН должен содержать ровно 12 цифр',
            'string.pattern.base': 'ИИН должен содержать только цифры',
            'any.invalid': 'ИИН не может состоять из одинаковых цифр'
        }),
        gender_id: Joi.number().integer().positive(),
        birth_date: Joi.date().max('now'),
        phone: Joi.string().pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/),
        programming_language_id: Joi.number().integer().positive().allow(null),
        custom_programming_language: Joi.string().max(100).allow('', null)
    }),

    createLanguage: Joi.object({
        name: Joi.string().min(1).max(50).required().messages({
            'any.required': 'Название языка обязательно',
            'string.max': 'Название не должно превышать 50 символов'
        })
    })
};

module.exports = {
    schemas
};