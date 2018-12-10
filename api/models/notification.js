const notification = (sequelize, DataTypes) => {
    const Notification = sequelize.define('notifications', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description_english: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        seen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        }

    }, {
        timestamps: false,
        underscored: true
    });

    Notification.associate = function(models) {
        models.notifications.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
        models.notifications.belongsTo(models.events, { foreignKey: 'entity_id', targetKey: 'id' });
    };

    return Notification;
};

module.exports = notification;
