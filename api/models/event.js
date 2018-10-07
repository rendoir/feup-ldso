const event = (sequelize, DataTypes) => {
    const EventModel = sequelize.define('events', {
        title: DataTypes.TEXT,
        description: DataTypes.TEXT,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        image_path: DataTypes.TEXT,
        latitude: DataTypes.REAL,
        longitude: DataTypes.REAL,
        location: DataTypes.TEXT,
        price: DataTypes.REAL,
    }, {
        timestamps: false,
        underscored: true
    });

    EventModel.associate = function (models) {
        models.events.belongsTo(models.entities, { foreignKey: 'entity_id', targetKey: 'id' });
    }

    return EventModel;
};

module.exports = event;