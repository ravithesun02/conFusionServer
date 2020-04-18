const mongoose=require('mongoose');

require('mongoose-currency').loadType(mongoose);

const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;


var commentScema=new Schema({
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

var dishScema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    featured:{
        type:Boolean,
        default:false
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    comments:[commentScema]
},{
    timestamps:true
});

var Dishes=mongoose.model('Dish',dishScema);

module.exports=Dishes;
