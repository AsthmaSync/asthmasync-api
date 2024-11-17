import { model, Schema, Types } from "mongoose";


const InhalerSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    medication: { type: Types.ObjectId, ref: 'Medication', required: true },
    puffs: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export const InhalerModel = model('Inhaler', InhalerSchema);