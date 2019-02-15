var Sequelize = require('sequelize');
// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://nlnuzqyqfyjfdb:50fdcfdaf376394d150f09872c88eb12c979ac9aa082c7ba4b92ec967d31b34f@ec2-174-129-224-157.compute-1.amazonaws.com:5432/derhj11bj69mb5');


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