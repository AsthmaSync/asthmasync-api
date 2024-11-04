import { Schema , model} from "mongoose";
import {toJson} from "@reis/mongoose-to-json";


const triggersSchema = new Schema ({
    triggers :{type:String, required:true},
    notes: {type:String, required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },

    },  {
        timestamps: true
    });

    triggersSchema.plugin(toJson)

    export const triggersModel = model('Trigger', triggersSchema)


