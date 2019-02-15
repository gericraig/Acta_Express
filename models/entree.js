var Sequelize = require('sequelize');
// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://nlnuzqyqfyjfdb:50fdcfdaf376394d150f09872c88eb12c979ac9aa082c7ba4b92ec967d31b34f@ec2-174-129-224-157.compute-1.amazonaws.com:5432/derhj11bj69mb5');

// setup User model and its fields.
var Entree = sequelize.define('entrees', {
    userid: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    }
}, {
    hooks: {
    },
});


// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Entree;