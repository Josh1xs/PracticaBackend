import { Schema, model } from "mongoose";

const laboratoriosSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    capacity: {
        type: Number
    },
    idMaestro: {
        type: Schema.Types.ObjectId,
        ref: "Maestros" // Relación con el modelo de maestros
    },
    status: {
        type: Boolean,
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Laboratorios", laboratoriosSchema);