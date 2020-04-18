var express = require('express');
var passport=require('passport');
var bodyparser=require('body-parser');
var User=require('../models/users');

var authenticate=require('../authenticate');

var router = express.Router();
router.use(bodyparser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,(err,user)=>
  {
    if(err)
    {
        res.statusCode=500;
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
    }
    else
    {
      user.firstname=req.body.firstname;
      user.lastname=req.body.lastname;
      user.save((err,user)=>{
        if(err)
        {
          res.statusCode=500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
          return ; 
        }
         
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:'Registration successful'});
        })

      });
    
    }
  })
});

router.post('/login',passport.authenticate('local'),(req,res)=>{

  let token=authenticate.getToken({_id:req.user._id});

 res.statusCode=200;
 res.setHeader('Content-Type','application/json');
 res.json({success:true,Token:token,status:'Logged In'});
});

router.get('/logout',(req,res,next)=>{
  if(req.session)
  {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  }
  else
  {
    var err=new Error('You are not logged in');
    err.status=403;
    next(err);
  }
});

module.exports = router;
