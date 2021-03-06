const express=require('express');
const bodyparser=require('body-parser');

const promoRouter=express.Router();

const Promotions=require('../models/promotions');

var authenticate=require('../authenticate');
var cors=require('./cors');

promoRouter.use(bodyparser.json());

promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
   Promotions.find({})
   .then((promos)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(promos);
   },(err)=>console.log(err))
   .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Promotions.create(req.body)
   .then((promos)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(promos);
},(err)=>console.log(err))
.catch((err)=>next(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/plain');
    res.end('Put is not allowed');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>console.log(err))
    .catch((err)=>next(err))
});

promoRouter.route('/:promoId')

.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promo)=>{
        if(promo!=null)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        }
        else
        {
            var err=new Error('Promotion with Id '+req.params.promoId+' is not found');
        }
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('Post method is not allowed On each promotions');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,req.body)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);

    },(err)=>console.log(err))
    .catch((err)=>next(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>console.log(err))
    .catch((err)=>next(err))
});

module.exports=promoRouter;

