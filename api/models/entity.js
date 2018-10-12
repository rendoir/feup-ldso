const entity = (sequelize, DataTypes) => {
    const Entity = sequelize.define('entities', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            unique: true
        },
        password: DataTypes.TEXT,
        email: {
            type: DataTypes.TEXT,
            unique: true
        },
        initials: {
            type: DataTypes.TEXT,
            unique: true
        },
        description: DataTypes.TEXT,
        image_path: DataTypes.TEXT,
        admin: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        color: {
            type: DataTypes.TEXT,
            default: "#FFFFFF"
        },
        color2: DataTypes.TEXT,
        location: DataTypes.TEXT

    }, {
        timestamps: false,
        underscored: true
    });

    Entity.associate = function(models) {
        models.entities.hasMany(models.events, {foreignKey: 'entity_id',targetKey: 'id'});
        models.entities.belongsToMany(models.users, { through: 'permissions'});
    }

    return Entity;
};

module.exports = entity;
