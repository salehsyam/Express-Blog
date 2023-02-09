module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('post', {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    post: {
      type: DataTypes.TEXT,
    },
  });

  Post.associate = function (models) {
    models.post.belongsTo(models.user, {
      onDelete: 'CASCADE',
    });
    models.post.hasMany(models.comment);
  };

  return Post;
};
