const permission = (sequelize, DataTypes) => {
    const Permission = sequelize.define('permissions', {}, {
        timestamps: false,
        underscored: true
    });
    
    return Permission;
};

module.exports = permission;
