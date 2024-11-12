import { Schema , model, Types} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";



const TriggersSchema = new Schema ({
    title:{type:String, required:true},
    notes: {type:String, required:true},
    user: { type: Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },

    },  {
        timestamps: true
    });

    TriggersSchema.plugin(toJSON)

    export const TriggersModel = model('Trigger', TriggersSchema)


