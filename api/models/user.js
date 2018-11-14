const user = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('mobile', 'moderator', 'admin'),
            default: 'mobile',
            allowNull: false
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
            default: null
        }
    }, {
        timestamps: false,
        underscored: true
    });

    User.associate = function(models) {
        models.users.belongsToMany(models.events, { through: 'favorites', as: 'favorite'});
        models.users.belongsToMany(models.entities, { through: 'permissions'});
        models.users.hasMany(models.events, {foreignKey: 'user_id', targetKey: 'id'});
    };

    return User;
};

module.exports = user;
