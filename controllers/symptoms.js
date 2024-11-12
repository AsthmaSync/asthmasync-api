import { SymptomsModel } from "../models/symptoms.js";
import { addSymptomValidator, updateSymptomValidator } from "../validators/symptoms.js";





export const getSymptoms = async (req, res, next) => {

    try {
        const { filter = "{}", limit = 50, skip = 0, sort ="{}" } = req.query;
        const symptoms = await SymptomsModel
        .find(JSON.parse(filter))
        .sort(JSON.parse(sort))
        .limit(limit)
        .skip(skip);

        res.status(200).json(symptoms);
    } catch (error) {
        next(error)

    }
}


export const getOneSymptom = async (req, res, next) => {
    try {
        // Fetch one entry
        const symptom = await SymptomsModel.findById(req.params.id);

        res.status(200).json(symptom)
    } catch (error) {
        next(error);

    }
}

export const addSymptom = async (req, res, next) => {

    try {
        // Validate user input
        const { error, value } = addSymptomValidator.validate(req.body)

        if (error) {
            return res.status(422).json(error)
        }


        // Enter symptom using the request body
        const newSymptom = await SymptomsModel.create({
            ...value,
            user: req.auth.id
        });

        // Return a success response with the recorded entry object 
        res.status(201).json({
            message: `Your entry "${newSymptom.title}" was recorded successfully!`,
            symptom: newSymptom
        });


        // Pass the error to the error-handling middleware
    } catch (error) {
        next(error);

    }
}

export const updateSymptomEntry = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = updateSymptomValidator.validate(req.body)

        if (error) {
            return res.status(422).json(error);
        }



        // // Find the entry by its ID and update it with the provided values, returning the updated document
        const updatedSympEntry = await SymptomsModel.findOneAndUpdate(
            {_id: req.params.id,
            user:req.auth.id    
        }, value, { new: true });
        
        if (!updatedSympEntry) {
            return res.status(404).json('Symptom was not found');
        }
        

        // Return a success response with the updated symptoms object 
        res.status(200).json({
            message: `Your entry "${updatedSympEntry.title}" was updated successfully!`,
            symptom: updatedSympEntry
        });


        // Pass the error to the error-handling middleware
    } catch (error) {
        next(error);
    }

}



export const deleteSymptomEntry = async (req, res, next) => {
    try {
        // Find and delete the entry by its ID
     const deleteSymptom =   await  SymptomsModel.findOneAndDelete(
        {_id: req.params.id,
        user:req.auth.id
    });
    if (!deleteSymptom) {
        return res.status(404).json('Entry (symptom) was not found');
    }

       // Respond with a success message after deletion
        res.status(200).json('Symptom was deleted!');
    } catch (error) {
        next(error)

    }
}


export const countSymptoms = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        //count symptoms in database
        const count = await SymptomsModel.countDocuments (JSON.parse(filter));

        //Respond to request
        res.json({count});
    } catch (error) {
        next(error);
        
    }

}