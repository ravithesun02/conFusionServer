const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const leaderSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false,
        required:true
    }
},{
    timestamps:true
});


var Leaders=mongoose.model('Leader',leaderSchema);

module.exports=Leaders;