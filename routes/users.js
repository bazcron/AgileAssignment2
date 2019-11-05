let mongoose = require('mongoose');
let users = require('../models/users');
let express = require('express');
let router = express.Router();

//let mongodbUri = 'mongodb+srv://barry:hobbit00@cluster0-58mmj.mongodb.net/agreeORdisagree?retryWrites=true&w=majority';
const connectionString = "mongodb://localhost:27017/usersdb"
mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', function (err) {
  console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
  console.log('Successfully Connected to [ ' + db.name + ' ]');
});

function getByValue(array, id) {
  let result = array.filter(function (obj) {return obj.id == id;});
  return result ? result[0] : null; // or undefined
}

function getUserById(array, id) {
  let result = array.filter(function (obj) {return obj.id == id;});
  return result ? result[0] : null; // or undefined
}

router.addUser = (req, res) => {
  //res.setHeader('Content-Type', 'application/json');
  //Add a new User
  let user = new users();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.agree = 0;
  user.disagree = 0;
  user.save(function(err) {
    if (err)
      res.json({ message: 'Unable to Add User. Sorry! Please try again.', errmsg : err } );
    else
      res.json({ message: 'User Added Successfully!', data: user });
  });
}


router.findAllUsers = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  users.find(function(err, users) {
    if (err)
      res.send(err);

    res.send(JSON.stringify(users,null,5));
  });
}

router.deleteUser = (req, res) => {
  //Delete the selected user based on its id
  users.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.json({ message: 'Sorry that User ID is not on our system!', errmsg : err } );
    else
      res.json({ message: 'User Deleted!'});
  });
}


router.findUser = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  users.find({ "_id" : req.params.id },function(err, user) {
    if (err)
      res.json({ message: 'User NOT Found!! Please Try Again', errmsg : err } );
    else
      res.send(JSON.stringify(user,null,5));
  });
}
router.agreedWithStatement = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // Find the relevant statement based on the id passed in
  // Add 1 to agree
  users.findById(req.params.id, function(err,user) {
    if (err)
      res.json({ message: 'Error that ID is not valid. Please try again!', errmsg : err } );
    else {
      user.agree =1;
      user.save(function (err) {
        if (err)
          res.json({ message: 'Unable to add 1 to Agree Value: Please try again!', errmsg : err } );
        else
          res.json({ message: 'You have Agreed with this statement. Agreed has been increased by 1!', data: user });
      });
    }
  });
}

router.disagreeWithStatement = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // Find the relevant statement based on the id passed in
  // Add 1 to disagree
  users.findById(req.params.id, function(err,user) {
    if (err)
      res.json({ message: 'Error that ID is not valid. Please try again!', errmsg : err } );
    else {
      user.disagree =1;
      user.save(function (err) {
        if (err)
          res.json({ message: 'Unable to add 1 to Disagree Value: Please try again!', errmsg : err } );
        else
          res.json({ message: 'You have Disagreed with this statement. Disagree has increased by 1!', data: user });
      });
    }
  });
}
module.exports = router;
