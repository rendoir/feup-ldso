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
            unique: true,
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
        admin: {
            type: DataTypes.BOOLEAN,
            default: false
        },

    }, {
        timestamps: false,
        underscored: true   
    });

    User.associate = function (models) {
        models.users.belongsToMany(models.events, { through: 'favorites'});
        models.users.belongsToMany(models.entities, { through: 'permissions'});
        models.users.hasMany(models.events, {foreignKey: 'poster_id',targetKey: 'id'});
    }   

    return User;
};

module.exports = user;
