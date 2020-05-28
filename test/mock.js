// // Import the mock library
// var SequelizeMock = require('sequelize-mock');

// // Setup the mock database connection
// var DBConnectionMock = new SequelizeMock();

// // Define our Model
// var UserMock = DBConnectionMock.define('users', {
//         'email': 'email@example.com',
//         'first_name': 'blink',
//         'last_name': 'onee',
//         'hashed_password':'hdgfgskjgfkjaeg'
//     });

// // You can also associate mock models as well
// var GroupMock = DBConnectionMock.define('groups', {
//     'name': 'My Awesome Group',
// });

// UserMock.belongsTo(GroupMock);

// // From there we can start using it like a normal model
// UserMock.findOne({
//     where: {
//         username: 'my-user',
//     },
// }).then(function (user) {
//     // `user` is a Sequelize Model-like object
//     user.get('id');         // Auto-Incrementing ID available on all Models
//     user.get('email');      // 'email@example.com'; Pulled from default values
//     user.get('first_name');   // 'my-user'; Pulled from the `where` in the query

// });