import { TriggersModel } from "../models/triggers.js";
import { addTriggerValidator, updateTriggerValidator } from "../validators/triggers.js";


export const getTriggers = async (req, res, next) => {

    try {
        const { filter = "{}", limit = 50, skip = 0, sort ="{}" } = req.query;
        const triggers = await TriggersModel
        .find(JSON.parse(filter))
        .sort(JSON.parse(sort))
        .limit(limit)
        .skip(skip);

        res.status(200).json(triggers);
    } catch (error) {
        next(error)

    }
}


export const getOneTrigger = async (req, res, next) => {
    try {
        // Fetch one entry
        const trigger = await TriggersModel.findById(req.params.id);

        res.status(200).json(trigger)
    } catch (error) {
        next(error);

    }
}

export const addTrigger = async (req, res, next) => {

    try {
        // Validate user input
        const { error, value } = addTriggerValidator.validate(req.body)

        if (error) {
            return res.status(422).json(error)
        }


        // Enter trigger using the request body
        const newTrigger = await TriggersModel.create({
            ...value,
            user: req.auth.id
        });

        // Return a success response with the recorded entry object 
        res.status(201).json({
            message: `Your entry "${newTrigger.title}" was recorded successfully!`,
            trigger: newTrigger
        });


        // Pass the error to the error-handling middleware
    } catch (error) {
        next(error);

    }
}

export const updateTriggerEntry = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = updateTriggerValidator.validate(req.body)

        if (error) {
            return res.status(422).json(error);
        }


        // // Find the entry by its ID and update it with the provided values, returning the updated document
        const updatedEntry = await TriggersModel.findOneAndUpdate(
            {_id: req.params.id,
            user:req.auth.id    
        }, value, { new: true });
        
        if (!updatedEntry) {
            return res.status(404).json('Trigger was not found');
        }

        // Return a success response with the updated trigger object 
        res.status(200).json({
            message: `Your entry "${updatedEntry.title}" was updated successfully!`,
            trigger: updatedEntry
        });


        // Pass the error to the error-handling middleware
    } catch (error) {
        next(error);
    }

}



export const deleteTriggerEntry = async (req, res, next) => {
    try {
        // Find and delete the entry by its ID
     const deleteTrigger =   await  TriggersModel.findOneAndDelete(
        {_id: req.params.id,
        user:req.auth.id
    });
    if (!deleteTrigger) {
        return res.status(404).json('Entry (Trigger) was not found');
    }

       // Respond with a success message after deletion
        res.status(200).json('Trigger was deleted!');
    } catch (error) {
        next(error)

    }
}


export const countTriggers = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        //count triggers in database
        const count = await TriggersModel.countDocuments (JSON.parse(filter));

        //Respond to request
        res.json({count});
    } catch (error) {
        next(error);
        
    }

}
