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
        underscored: true,
        validate: {
            checkDates() {
                if(this.end_date !== null)
                    if(this.start_date > this.end_date)
                        throw new Error("The end date must be after the start date");
            }
        }
    });

    EventModel.associate = function (models) {
        models.events.belongsTo(models.entities, { foreignKey: 'entity_id', targetKey: 'id' });
    }

    return EventModel;
};

module.exports = event;