import { Schema, model } from "mongoose";


const medicationSchema = new Schema({
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    purpose: { type: String, enum: ["preventive", "reliever"], required: true },
    // notes: { type: String, trim: true },  
    taken: { type: Boolean, required: true, default: false },
    dosageTaken: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export const MedicationModel = model('Medication', medicationSchema);