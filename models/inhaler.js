import { model, Schema, Types } from "mongoose";


const InhalerSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    inhalerId: { type: Types.ObjectId, ref: 'Inhaler', required: true },
    inhalerName: {type: String, required:true},
    oriTotal: { type: Number, required: true, min: 1 },
    newTotal: { type: Number, min: 1 },
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