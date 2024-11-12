import { Schema , model, Types} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const symptomsSchema = new Schema ({
    title :{type:String, required:true},
    notes: {type:String, required:true},
    date: { type: Date, default: Date.now },
    user: { type: Types.ObjectId, ref: 'User', required: true }

    }, {
        timestamps: true 
    });

    symptomsSchema.plugin(toJSON)

export const SymptomsModel = model('Symptom', symptomsSchema)