module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100]
            }
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true
    });

    User.associate = (models) => {
        User.hasMany(models.Form, {
            foreignKey: 'user_id',
            as: 'forms'
        });
    };

    return User;
};