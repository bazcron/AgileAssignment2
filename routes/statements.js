let statements = require('../models/statements');
let express = require('express');
let router = express.Router();

/*router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(statements,null,5));
    // Return a JSON representation of our list
    res.json(statements);
}*/

/*router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    statements.find(function(err, statements) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(statements,null,5));
    });
}*/

router.findAll = function(req, res) {

    // Use the statements model to find all statements
    statements.find(function(err, statement) {
        if (err)
            res.send(err);
        else {
            // console.log(statements)
            res.json(statement);
        }
    });
}


function getByValue(array, id) {
    let result = array.filter(function (obj) {return obj.id == id;});
    return result ? result[0] : null; // or undefined
}

/*router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let statement = getByValue(statements,req.params.id);

    if (statement != null)
        res.send(JSON.stringify(statement,null,5));
    else
        res.send('That Statement is not here');
}*/

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    statements.find({ "_id" : req.params.id },function(err, statement) {
        if (err)
            res.json({ message: 'Statement NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(statement,null,5));
    });
}

/*router.addStatement = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //I needed any new statements id to follow on from the last id, (the highest number) even if statements were deleted,
    //as i want to control the sequence of statements.
    //So i first checked if length of statements was 0, (if there were no statements), if it was zero it meant that there
    //were no statements, so i set the id to 1
    let id=0;
    if (statements.length ==0){
        id=1;
    }//else i took the last element of the array and added 1 to it.
    else {
        let numberOfStatements = statements[statements.length - 1];
        id = numberOfStatements.id + 1;   // add one to number of statements to give new statement the next id
    }
    statements.push({"id": id, "statement": req.body.statement, "agree": 0, "disagree": 0});

    if(id > 0)
        res.json({ message: 'Statement has been successfully Added!'});
    else
        res.json({ message: 'Sorry unable to add Statement'});
}*/

router.addStatement = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let statement = new statements();

    statement.statement = req.body.statement;
    statement.agree = 0;
    statement.disagree = 0;

    statement.save(function(err) {
        if (err)
            res.json({ message: 'Statement NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Statement Successfully Added!', data: statement });
    });
}

router.agreedWithStatement = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // Find the relevant statement based on the id passed in
    // Add 1 to agree
    statements.findById(req.params.id, function(err,statement) {
        if (err)
            res.json({ message: 'Error that ID is not valid. Please try again!', errmsg : err } );
        else {
            statement.agree +=1;
            statement.save(function (err) {
                if (err)
                    res.json({ message: 'Unable to change Agree Value: Please try again!', errmsg : err } );
                else
                    res.json({ message: 'You have Agreed with this statement!', data: statement });
            });
        }
    });
}


router.disagreeWithStatement = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // Find the relevant statement based on the id passed in
    // Add 1 to disagree
    statements.findById(req.params.id, function(err,statement) {
        if (err)
            res.json({ message: 'Error that ID is not valid. Please try again!', errmsg : err } );
        else {
            statement.disagree +=1;
            statement.save(function (err) {
                if (err)
                    res.json({ message: 'Unable to change Disagree Value: Please try again!', errmsg : err } );
                else
                    res.json({ message: 'You have Disagreed with this statement!', data: statement });
            });
        }
    });
}

router.deleteStatement = (req, res) => {
    //Delete the selected statement based on its id.
    statements.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Sorry That ID was not valid: Statement Deletion was not possible!', errmsg : err } );
        else
            res.json({ message: 'Statement Deleted!'});
    });
}



module.exports = router;