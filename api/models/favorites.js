const favorite = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('favorites', {}, {
        timestamps: false,
        underscored: true
    });
    
    return Favorite;
};

module.exports = favorite;
