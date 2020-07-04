var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passwordModel = require('../models/password');
const passwordDetailModel = require('../models/password_detail');



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
    return res.redirect('/');
 }
 next()
}

/* GET password category listing. */
router.get('/list-category',isLogged, function(req, res, next) {
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );
passwordModel.find({})
.exec((err,data)=>{
  res.render('password/password_category',{username:data.username,results:data,error:''})

  });

});


/* SHow categrry listing. */
router.get('/create-category',isLogged, function(req, res, next) {
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );
  res.render('password/add_category',{username:data.username,error:''});

});







/**delete category */
router.get("/delete-category/:delId",(req,res,next)=>{
    let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );                             
  passwordModel.findOneAndDelete({'_id':req.params.delId},(err,result)=>{
    if(err){
      throw err;
    }else{
      passwordModel.find({})
    .exec((err,data)=>{
        return res.render('password/password_category',{username:data.username,results:data,error:'category deleted'})
    
      });
    }
  });
});




/** show edit  form */
router.get("/edit-category/:editId",(req,res,next)=>{
    let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );                             
  passwordModel.findOne({'_id':req.params.editId},(err,result)=>{
    if(err){
      throw err;
    }else{
      console.log(req.params.editId,'editid');
      
      return res.render('password/edit_category',{username:data.username,result:result,error:''})

    }
  });
});



/* UPDATION CATEGORY */
router.post('/update-password-category',isLogged, function(req, res, next) {
  let {type,update_id}=req.body;
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );                             
  let password= passwordModel.findOneAndUpdate({'_id':update_id},{
    type:type
  })
  password.exec(function(err,result) {
    if (err) {
      throw err;
    }
    return res.redirect('/password/list-category')
  })
  

});
 


/* GET password category listing. */
router.post('/add-password-category',isLogged, function(req, res, next) {
  let {type}=req.body;
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );                             
  let password=new passwordModel({
    type:type
  })
  password.save()
  .then((result) => {
     return  res.render('password/add_category',{username:data.username,error:'Category added'})
 }).catch((err) => {
    throw err;
  });

});
 










/********************************************************* */
// ADDD PASSWOD DETAIL 
/********************************************************* */

/* GET password detail listing. */
router.get('/list-password', isLogged,function(req, res, next) {
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );
  passwordDetailModel.find({})
  .exec()
  .then((result) => {
  res.render('password/password_details',{username : data.username,results:result,error :''})
    
  }).catch((err) => {
    throw err;
  });
  
});

/* GET add password detail listing. */
router.get('/add-password',isLogged, function(req, res, next) {
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );

  passwordModel.find({})
  .exec()
  .then((result) => {
      return  res.render('password/add_password',{username :data.username,error :'',result:result})
    
  }).catch((err) => {
    throw error
  });

});

/* add password dettail */
router.post('/save-password',isLogged, function(req, res, next) {
  let {type,description}=req.body;
  
  let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );                             
  let password=new passwordDetailModel({
    type:type,description:description
  });;
  
  password.save()
  .then((result) => {
     return  res.redirect('/password/list-password')
    //  return  res.render('password/list_password',{username:data.username,error:'password detail  added'})
 }).catch((err) => {
    throw err;
  });

});
 

/**delete passwod */
router.get("/delete-password/:delId",(req,res,next)=>{
    let data=  jwt.verify(localstorage.getItem('pms') ,'token4pms' );                             
  passwordDetailModel.findOneAndDelete({'_id':req.params.delId},(err,result)=>{
    if(err){
      throw err;
    }else{
      return res.redirect('/password/list-password')
    //   passwordDetailModel.find({})
    // .exec((err,result)=>{
    //   if (err) {
    //     throw  err;
    //   }
    //     return res.render('password/list_password',{username:data.username,results:result,error:'password deleted'})
    
    //   });
    }
  });
});



module.exports = router;
