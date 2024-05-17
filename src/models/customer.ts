import mongoose, {Schema, Document} from "mongoose";
import { OrderDoc } from "./order";

export interface customerDoc extends Document{
    email:string,
    password:string,
    salt:string,
    firstName:string,
    lastName:string,
    address:string,
    phone:number,
    verified:boolean,
    otp:number,
    otp_expiery:Date,
    lat:number,
    lng:number,
    cart:[any],
    orders:[OrderDoc]
}

const CustomerSchema = new Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    salt:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    address:{type:String, required:true},
    phone:{type:String, required:true},
    verified:{type:Boolean, required:true},
    otp:{type:Number, required:true},
    otp_expiery:{type:Date, required:true},
    lat:{type:Number},
    lng:{type:Number},
    cart: [
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', require: true},
            unit: { type: Number, require: true}
        }
    ],
    orders:[{
        
           type:Schema.Types.ObjectId,
           ref:'order', 
        
    }]
},{
    toJSON:{
        transform(doc,ret){
         delete ret.__v;
         delete ret.password;
         delete ret.salt;
         delete ret.updatedAt;
         delete ret.updatedAt;
        }
    },
    timestamps:true
})

const Customer = mongoose.model<customerDoc>('customer', CustomerSchema)
export{Customer};