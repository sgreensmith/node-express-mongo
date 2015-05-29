var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//\\ GET hello world page as per tutorial
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', {title: 'Hello, World!'})
});

//\\ new route that makes use of the database
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e, docs) {
      res.render('userlist', {"userlist": docs });
  });
});

//\\ new route for adding a user to the databse
router.get('/newuser', function(req, res) {
  res.render('newuser', {title: 'Add New User'});
});

//\\ the following enables app to deal with a POST to add user, pointed at /adduser
router.post('/adduser', function(req,res) {

    var db = req.db;    // set the database variable

    var userName = req.body.username;       // extract data from request
    var userEmail = req.body.useremail;     // extract data from request

    var collection = db.get('usercollection');      // set the collection

    collection.insert(
        {"username" : userName, "useremail" : userEmail },
        function (err, doc) {
            if (err) {
                res.send("There was a problem adding info to the database")
            } else {
                res.location("userlist");   //sets the client to userlist
                res.redirect("userlist");   // redirects to userlist
            }
        }
    );
});

module.exports = router;
