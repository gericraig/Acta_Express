var Sequelize = require('sequelize');
// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('mysql://ruzbr64gyqulrclw:bk7a5ftha8oloopx@z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/fy2di9gjooiln47y');

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