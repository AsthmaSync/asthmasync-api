import { Schema, model, Types } from "mongoose";


const medicationSchema = new Schema({
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true, enum: ["daily", "weekly", "monthly"], lowercase: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    purpose: { type: String, enum: ["preventive", "reliever"], required: true },
    taken: { type: Boolean, default: false },
    dosageTaken: { type: Number },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    nextNotification: { type: Date } // New field to track notifications
}, {
    timestamps: true
});

export const MedicationModel = model('Medication', medicationSchema);