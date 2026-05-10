import { Schema, model } from "mongoose";

const maestrosSchema = new Schema ({
    name : {
        type: String
    },
    lastName : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    isActive : {
        type : Boolean
    },
    isVerified : {
        type : Boolean
    },
    loginAttemps :{
        type : Number
    },
    timeOut : {
        type : Date
    }
  }, {  
     timestamps: true,
    strict: false
})


export default model("Maestros", maestrosSchema)