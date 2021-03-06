const express=require('express');
const bodyparser=require('body-parser');

const leaderRouter=express.Router();

const Leader=require('../models/leaders');

var authenticate=require('../authenticate');
var cors=require('./cors');
leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
   Leader.find({})
   .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
   },(err)=>console.log(err))
   .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.create(req.body)
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('Put is not allowed on /leaders');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Leader.remove({})
   .then((resp)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(resp);
   },(err)=>console.log(err))
   .catch((err)=>next(err))
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((leader)=>{
        if(leader!=null)

        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }
        else
        {
            var err=new Error('Leader with Id '+req.params.leaderId+' not found');
            err.statusCode=404;
            return next(err);
        }
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('Not allowed ');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Leader.findByIdAndUpdate(req.params.leaderId,req.body)
   .then((leader)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(leader);
   },(err)=>console.log(err))
   .catch((err)=>next(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Leader.findByIdAndRemove(req.params.leaderId)
   .then((resp)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(resp);
   },(err)=>console.log(err))
   .catch((err)=>next(err))
});

module.exports=leaderRouter;

