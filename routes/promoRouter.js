const express=require('express');
const bodyparser=require('body-parser');

const promoRouter=express.Router();

promoRouter.use(bodyparser.json());

promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;

    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('send all dishes');
})
.post((req,res,next)=>{
    res.end('post method call');
})
.put((req,res,next)=>{
    res.end('update fn');
})

.delete((req,res,next)=>{
    res.end('delete fn');
});

promoRouter.route('/:dishId')
.all((req,res,next)=>{
    res.statusCode=200;

    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('send all dishes'+req.params.dishId);
})
.post((req,res,next)=>{
    res.end('post method call');
})
.put((req,res,next)=>{
    res.end('update fn');
})

.delete((req,res,next)=>{
    res.end('delete fn');
});

module.exports=promoRouter;

