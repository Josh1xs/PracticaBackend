import { Schema, model } from "mongoose";

const salonesSchema = new Schema({
    code: {
        type: String, // Ejemplo: "A-2"
    },
    building: {
        type: String
    },
    level: {
        type: Number
    },
    maxCapacity: {
        type: Number
    },
    hasProjector: {
        type: Boolean,
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Salones", salonesSchema);