const express=require('express');
const bodyparser=require('body-parser');

const mongoose=require('mongoose');

const Dishes=require('../models/dishes');

var authenticate=require('../authenticate');
var cors=require('./cors');

const dishRouter=express.Router();

dishRouter.use(bodyparser.json());

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err)=>{console.log(err)})
    .catch((err)=>{ next(err) })
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log(dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>{console.log(err)})
    .catch((err)=>{next(err)})
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.setHeader('Content-Type','text/plain');
    res.end('Put is not allowed');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    })
});

dishRouter.route('/:dishId')

.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))

.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>{console.log(err)})
    .catch((err)=>{next(err)})
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    res.end('post method call Not allowed');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,req.body,{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    })
    
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Dishes.findByIdAndRemove(req.paramas.dishId)
   .then((resp)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(resp);
   },(err)=>{
       console.log(err);
   })
   .catch((err)=>{next(err)})
});

dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish!=null)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else
        {

            var err=new Error('Dish not found with Id '+req.params.dishId);
            err.statusCode=404;
            return next(err);
        }
    },(err)=>{console.log(err)})
    .catch((err)=>{
        next(err);
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null)
        {
            req.body.author=req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish.comments);
                })
              
            },(err)=>console.log(err))
        }
        else
        {
            var err=new Error('Dish not found with Id '+req.params.dishId);
            err.statusCode=404;
            return next(err);
        }
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('Update is not supported for comments section with Id'+req.params.dishId);
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null)
        {
            for(let i=0;i<dish.comments.length;i++)
                {
                    dish.comments.id(dish.comments[i]._id).remove();
                }
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=>console.log(err))
            .catch((err)=>next(err))
        }
        else
        {
            var err=new Error('Dish not found with Id '+req.params.dishId);
            err.statusCode=404;
            return next(err);
        }
    })
    .catch((err)=>next(err))
});

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId)!=null)
        {
            res.statusCode=200;
            res.setHeader('Content-type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish == null)
        {
            var err=new Error('Dish not found with Id '+req.params.dishId);
            err.statusCode=404;
            return next(err);
        }
        else
        {
            var err=new Error('Comment not found with Id '+req.params.commentId);
            err.statusCode=404;
            return next(err);
        }
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('Post is not allowed on comment with Id '+req.params.commentId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
       // console.log(req.user._id+" "+dish.comments.id(req.params.commentId).author);
        if(dish!=null && dish.comments.id(req.params.commentId)!=null && req.user._id.equals(dish.comments.id(req.params.commentId).author))
        {

            dish.comments.id(req.params.commentId).rating=req.body.rating ? req.body.rating : dish.comments.id(req.params.commentId).rating;
            dish.comments.id(req.params.commentId).comment=req.body.comment ? req.body.comment : dish.comments.id(req.params.commentId).comment;
            
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish.comments.id(req.params.commentId));
                })
              
            },(err)=>console.log(err))
            .catch((err)=>next(err))
        }
        else if(dish == null)
        {
            var err=new Error('Dish not found with Id '+req.params.dishId);
            err.statusCode=404;
            return next(err);
        }
        else if(dish.comments.id(req.params.commentId)==null)
        {
            var err=new Error('Comment not found with Id '+req.params.commentId);
            err.statusCode=404;
            return next(err);
        }
        else
        {
            var err=new Error('You are not authorized to perform this operation');
            err.statusCode=403;
            return next(err);
        }
   
    },(err)=>console.log(err))
    .catch((err)=>next(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentId)!=null && req.user._id.equals(dish.comments.id(req.params.commentId).author))
        {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish.comments);
                })
                
               
            },(err)=>console.log(err))
            .catch((err)=>next(err))
        }
        else if(dish == null)
        {
            var err=new Error('Dish not found with Id '+req.params.dishId);
            err.statusCode=404;
            return next(err);
        }
        else if(dish.comments.id(req.params.commentId)==null)
        {
            var err=new Error('Comment not found with Id '+req.params.commentId);
            err.statusCode=404;
            return next(err);
        }
        else
        {
            var err=new Error('You are not authorized to perform this operation');
            err.statusCode=403;
            return next(err);
        }
    },(err)=>console.log(err))
    .catch((err)=>next(err))
});

module.exports=dishRouter;

