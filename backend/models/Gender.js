module.exports = (sequelize, DataTypes) => {
    const Gender = sequelize.define('Gender', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'genders',
        timestamps: true,
        underscored: true
    });

    Gender.associate = (models) => {
        Gender.hasMany(models.Form, {
            foreignKey: 'gender_id',
            as: 'forms'
        });
    };

    return Gender;
};