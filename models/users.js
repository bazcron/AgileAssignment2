/*const users = [
    {id: 1000000, name: 'Baz', email: "bazcron@yahoo.co.uk", password: "baz", agree:0, disagree:0},
    {id: 1000001, name: 'Paul', email: "pc18765@gmail.com", password: "paul", agree:0, disagree:0}
];
module.exports = users;*/

let mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
        id: Number,
        name: String,
        email: String,
        password: String,
        agree: Number,
        disagree: Number
    },
    { collection: 'users' });

module.exports = mongoose.model('users', usersSchema);