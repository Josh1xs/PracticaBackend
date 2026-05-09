import { Schema, model } from "mongoose";

const estudianteSchema = new Schema ({
    name : {
        type: String
    },
    lastname : {
        type: String
    },
    email : {
        type: String
    },
    password : {
        type: String
    },
    career : {
        type : String
    },
    isVerified : {
        type : Boolean
    },
    loginAttempts : {
        type : Number
    },
    timeOut : {
        type : Date
    },
    },{
        timestamps: true,
        strict: false

})


export default model("estudiante", estudianteSchema)