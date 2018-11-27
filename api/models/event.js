const event = (sequelize, DataTypes) => {
    const EventModel = sequelize.define('events', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title_english: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description_english: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.REAL
        }
    }, {
        timestamps: false,
        underscored: true,
        validate: {
            checkDates() {
                if (this.end_date != null) {
                    if (this.start_date > this.end_date)
                        throw new Error("The end date must be after the start date");
                } else this.end_date = null;
            }
        },
        hooks: {
            beforeCreate: function(event) {
                return sequelize.models.permissions.find({
                    where: {
                        user_id: event.user_id,
                        entity_id: event.entity_id
                    }
                })
                    .then((res) => {
                        if (!res){
                            throw new Error('User doesn\'t have permission');
                        }
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            },
            beforeUpdate: function(event) {
                return sequelize.models.permissions.find({
                    where: {
                        user_id: event.user_id,
                        entity_id: event.entity_id
                    }
                })
                    .then((res) => {
                        if (!res){
                            throw new Error('User doesn\'t have permission');
                        }
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            },
            beforeDelete: function(event) {
                return sequelize.models.permissions.find({
                    where: {
                        user_id: event.user_id,
                        entity_id: event.entity_id
                    }
                })
                    .then((res) => {
                        if (!res){
                            throw new Error('User doesn\'t have permission');
                        }
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            }
        }
    });

    EventModel.associate = function(models) {
        models.events.belongsToMany(models.categories, { through: 'event_categories'});
        models.events.belongsToMany(models.users, { through: 'favorites', as: 'favorite'});
        models.events.belongsTo(models.entities, { foreignKey: 'entity_id', targetKey: 'id' });
        models.events.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
    };

    return EventModel;
};

module.exports = event;
