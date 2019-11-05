/*const statements = [
    {id: 1, statement: 'There is a God', agree: 0, disagree: 0},
    {id: 2, statement: 'Prisons in Ireland are like Holiday Camps', agree: 0, disagree: 0},
    {id: 3, statement: 'The thought of a Prison Sentence is not a deterrent for career criminals', agree: 0, disagree: 0},
    {id: 4, statement: 'Prison needs to be a Punishment', agree: 0, disagree: 0},
    {id: 5, statement: 'Road speed signs deter speeding', agree: 0, disagree: 0}
];
module.exports = statements;*/

let mongoose = require('mongoose');
//
let statementSchema = new mongoose.Schema({
        id: Number,
        statement: String,
        agree: Number,
        disagree:Number
    },
    { collection: 'statements' });

module.exports = mongoose.model('statements', statementSchema);