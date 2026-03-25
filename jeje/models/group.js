import mongoose,{ mongo } from "mongoose";

const GroupSchema= mongoose.Schema({
    name:String,
    image:String,
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"  
        },
    ],
});
export const Group =mongoose.model("Group",GroupSchema)