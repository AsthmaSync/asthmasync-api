import { MedicationModel } from "../models/medication.js";
import { addMedicationValidator, updateMedicationValidator } from "../validators/medication.js";


export const getMedication = async (req, res, next) => {

    try {
        const { filter = "{}", limit = 50, skip = 0, sort ="{}" } = req.query;
        const medications = await MedicationModel
        .find(JSON.parse(filter))
        .sort(JSON.parse(sort))
        .limit(limit)
        .skip(skip);

        res.status(200).json(medications);
    } catch (error) {
        next(error)

    }
}


export const getOneMedication = async (req, res, next) => {
    try {
        // Fetch one entry
        const medication = await MedicationModel.findById(req.params.id);

        res.status(200).json(medication)
    } catch (error) {
        next(error);

    }
}

export const addMedication = async (req, res, next) => {
    try {
        const { error, value } = addMedicationValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        // Calculate the next notification date
        const frequencyMap = {
            daily: 1,
            weekly: 7,
            monthly: 30
        };

        const nextNotification = new Date(value.startDate);
        nextNotification.setDate(nextNotification.getDate() + frequencyMap[value.frequency]);

        // Save medication with notification date
        const newMedication = await MedicationModel.create({
            ...value,
            user: req.auth.id,
            nextNotification
        });

        res.status(201).json({
            message: `Your medication "${newMedication.name}" was recorded successfully!`,
            medication: newMedication
        });
    } catch (error) {
        next(error);
    }
};


export const updateMedication = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = updateMedicationValidator.validate(req.body)

        if (error) {
            return res.status(422).json(error);
        }


        // // Find the entry by its ID and update it with the provided values, returning the updated document
        const updatedDrug = await MedicationModel.findOneAndUpdate(
            {_id: req.params.id,
            user:req.auth.id    
        }, value, { new: true });
        
        if (!updatedDrug) {
            return res.status(404).json('Medication was not found');
        }

        // Return a success response with the updated medication object 
        res.status(200).json({
            message: `Your medication "${updatedDrug.name}" was updated successfully!`,
            symptom: updatedDrug
        });


        // Pass the error to the error-handling middleware
    } catch (error) {
        next(error);
    }

}



export const deleteMedication = async (req, res, next) => {
    try {
        // Find and delete the entry by its ID
     const deleteDrug =   await  MedicationModel.findOneAndDelete(
        {_id: req.params.id,
        user:req.auth.id
    });
    if (!deleteDrug) {
        return res.status(404).json('Medication was not found');
    }

       // Respond with a success message after deletion
        res.status(200).json('Medication was deleted!');
    } catch (error) {
        next(error)

    }
}


export const countMedication = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        //count medication in database
        const count = await MedicationModel.countDocuments (JSON.parse(filter));

        //Respond to request
        res.json({count});
    } catch (error) {
        next(error);
        
    }

}