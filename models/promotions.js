const mongoose=require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;

const PromoSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
    },
    label:{
        type:String,

    },
    price:Currency,
    featured:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

var Promotions=mongoose.model('Promotion',PromoSchema);

module.exports=Promotions;