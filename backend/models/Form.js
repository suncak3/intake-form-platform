module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define('Form', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 50] }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 50] }
        },
        middle_name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { len: [0, 50] }
        },
        iin: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true,
            validate: {
                len: [12, 12],
                isNumeric: true
            }
        },
        gender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'genders',
                key: 'id'
            }
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true,
                isBefore: new Date().toISOString()
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
            }
        },
        programming_language_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'programming_languages',
                key: 'id'
            }
        },
        custom_programming_language: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'forms',
        timestamps: true,
        underscored: true
    });

    Form.associate = (models) => {
        Form.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Form.belongsTo(models.Gender, {
            foreignKey: 'gender_id',
            as: 'gender'
        });

        Form.belongsTo(models.ProgrammingLanguage, {
            foreignKey: 'programming_language_id',
            as: 'programming_language'
        });
    };

    return Form;
};