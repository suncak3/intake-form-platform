module.exports = (sequelize, DataTypes) => {
    const ProgrammingLanguage = sequelize.define('ProgrammingLanguage', {
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
        is_predefined: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'programming_languages',
        timestamps: true,
        underscored: true
    });

    ProgrammingLanguage.associate = (models) => {
        ProgrammingLanguage.hasMany(models.Form, {
            foreignKey: 'programming_language_id',
            as: 'forms'
        });
    };

    return ProgrammingLanguage;
};