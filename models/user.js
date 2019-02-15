var Sequelize = require('sequelize');
// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://postgres@localhost:5432/hobby-dev');


// setup User model and its fields.
var User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: (user) => {
      user.password = user.password, salt;
    }
  },
});


// create all the defined tables in the specified database.
sequelize.sync()
  .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
  .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;