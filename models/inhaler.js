import { model, Schema, Types } from "mongoose";

const InhalerSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    inhalerName: { type: String, required: true },
    oriTotal: { type: Number, min: 1, required: true }, // Fixed total puffs
    newTotal: { type: Number, min: 1 }, // Remaining puffs, initialized to oriTotal (not required initially)
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const InhalerModel = model('Inhaler', InhalerSchema);





// const PuffUsageSchema = new Schema({
//     user: { type: Types.ObjectId, ref: 'User', required: true },
//     inhalerId: { type: Types.ObjectId, ref: 'Inhaler', required: true },
//     puffsUsed: { type: Number, required: true, min: 1 },
//     date: { type: Date, default: Date.now }
// }, {
//     timestamps: true
// });

// export const PuffUsageModel = model('Puffs', PuffUsageSchema);