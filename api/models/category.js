const category = (sequelize, DataTypes) => {
    const Category = sequelize.define('categories', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            unique: true
        },
        description: DataTypes.TEXT
    }, {
        timestamps: false,
        underscored: true
    });

    return Category;
};

module.exports = category;
