var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');


if (typeof localstorage == 'undefined' || localstorage == null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localstorage = new LocalStorage('./localstorage')
}

// verify useer loggedin or not
function isLogged(req,res,next) {
  try {
    let userdata =localstorage.getItem('pms');
    let decode=  jwt.verify(userdata ,'token4pms' );
  } catch (error) {
   req.session.error='please loggedIn first';
   res.render('index', { title: 'welcome to password management system', username :'',
  error:req.session.error });
   req.session.error=null;
 }
 next()
}

/* GET home page. */
router.get('/', function (req, res, next) {
   if ( localstorage.getItem('pms') !=null ) {
     return res.redirect('/dashboard')
   } else {
      return res.render('index', { title: 'welcome to password management system', error:'',username:''});
}
});



// logout
router.get('/logout', function (req,res,next) {
  localstorage.removeItem('pms')
  return res.redirect('/')
});


/* GET dashbooard page. */
router.get('/dashboard',isLogged,  function (req, res, next) {
  let userdata =localstorage.getItem('pms');
  if ( userdata===null ) {
    return res.render('index', { title: 'welcome to password management system',     error:req.session.error });
    
  } else {
  let data=  jwt.verify(userdata ,'token4pms' )
  return res.render('dashboard', { title: 'welcome to dashbord',username:data.username });
  }
});



router.post('/login', function (req, res, next) {
  const { email, password } = req.body;
  userModel.findOne({ email: email }, function (err, result) {
    if (err) {
      throw err;
    } else {
      //  console.log(result);
      if (result === null) {
        return res.render('index', { title: 'welcome to password management system', error: 'email not valid', username: '' });

      } else {
        // Load hash from your password DB.
        bcrypt.compare(password, result.password, function (err, hashed_result) {
          if (err) {
            throw err;
          } else {

            if (hashed_result === false) {
              return res.render('index', { title: 'welcome to password management system', error: 'incorrect entered password',username:'' });

            } else {
           
              let payload = {
                username: result.username,
                id: result._id,
              }
               let token = jwt.sign(payload, 'token4pms',{
                expiresIn:'5h'
              });
              
              localstorage.setItem('pms', token)
              // redirect to dashbooard
              return res.redirect('/dashboard');
            }

          }
        });

      }

    }
  })

});


module.exports = router;
