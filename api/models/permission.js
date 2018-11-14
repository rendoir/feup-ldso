const permission = (sequelize) => {
    const Permission = sequelize.define('permissions', {}, {
        timestamps: false,
        underscored: true
    });

    return Permission;
};

module.exports = permission;
