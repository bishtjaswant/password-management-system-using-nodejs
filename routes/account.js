var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const saltRounds = 10;

function isUsernameExist(req,res,next) {
  let {username}=req.body;
  let userExist= userModel.findOne({username:username});
  userExist.exec(function (err,result) {  
    if (err) {
      throw err
    }
    if (result) {
       return res.render('account/create', {error:'usename  already exist' });
  }
  next()
  })
}


function isEmailExist(req,res,next) {
  let {email}=req.body;
  let emailExist= userModel.findOne({email:email});
  emailExist.exec(function (err,result) {  
    if (err) {
      throw err;
    }
    if (result) {
       return res.render('account/create', {error:'Email  already exist' });
  }
  next()
  });
}
/* GET home page. */
router.get('/create', function(req, res, next) {
  
  return res.render('account/create', {error:'',username:""});

});

router.post('/save',isUsernameExist,isEmailExist, function(req, res, next) {
  let  { username, email,password }=req.body;;

  // to hash a password 
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
              if (err) {
                throw err;
              } else {
                let user = new userModel({ username: username, email: email, password: hash } );;
                user.save()
                .then((result) => {
                 return res.redirect('/')
                }).catch((err) => {
                  throw err
                });
              }
    });
});
   
});





module.exports = router;
