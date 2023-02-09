var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    }
  );
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.associate = function (models) {
    models.user.hasMany(models.post);
  };
  return User;
};
