import { Schema , model, Types} from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";



const TriggersSchema = new Schema ({
    title:{type:String, required:true},
    notes: {type:String, required:true},
    date: { type: Date, default: Date.now },
    user: { type: Types.ObjectId, ref: 'User', required: true },

    },  {
        timestamps: true
    });

    TriggersSchema.plugin(toJSON)

    export const TriggersModel = model('Trigger', TriggersSchema)


