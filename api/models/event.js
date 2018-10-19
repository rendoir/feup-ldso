const event = (sequelize, DataTypes) => {
    const EventModel = sequelize.define('events', {
        title: DataTypes.TEXT,
        description: DataTypes.TEXT,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,  
        location: DataTypes.TEXT,
        price: DataTypes.REAL,
    }, {
        timestamps: false,
        underscored: true,
        validate: {
            checkDates() {
                if(this.end_date != "") {
                    if(this.start_date > this.end_date)
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
                    if(!res){
                        throw new Error('User doesn\'t have permission');
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                })
            },
            beforeUpdate: function(event) {
                return sequelize.models.permissions.find({
                    where: {
                        user_id: event.user_id,
                        entity_id: event.entity_id
                    }
                })
                .then((res) => {
                    if(!res){
                        throw new Error('User doesn\'t have permission');
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                })
            }
        } 
    });

    EventModel.associate = function (models) {
        models.events.belongsToMany(models.users, { through: 'favorites'});
        models.events.belongsTo(models.entities, { foreignKey: 'entity_id', targetKey: 'id' });
        models.events.belongsTo(models.users, { foreignKey: 'user_id', targetKey: 'id' });
    }

    return EventModel;
};

module.exports = event;