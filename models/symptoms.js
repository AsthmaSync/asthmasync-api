import { Schema , model} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const symptomsSchema = new Schema ({
    symptoms :{type:String, required:true},
    notes: {type:String, required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },

    }, {
        timestamps: true 
    });

    symptomsSchema.plugin(toJSON)

export const symptomsModel = model('Symptom', symptomsSchema)