import { InhalerModel } from "../models/inhaler.js";
import {addInhalerValidator, recordPuffUsageValidator} from "../validators/inhaler.js"

// export const getPuffUsage = async (req, res, next) => {
//     try {
//         const { filter = '{}', limit = 10, skip = 0, sort = '{}' } = req.query;

//         const puffUsage = await PuffUsageModel.find({
//             ...JSON.parse(filter),
//             user: req.auth.id
//         })
//             .sort(JSON.parse(sort))
//             .limit(Number(limit))
//             .skip(Number(skip));

//         res.status(200).json({
//             message: 'Puff usage records retrieved successfully.',
//             puffUsage
//         });
//     } catch (error) {
//         next(error);
//     }
// };

export const addInhaler = async (req, res, next) => {
    try {
        const { error, value } = addInhalerValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: 'Invalid input.', details: error.details });
        }

        const { inhalerName, oriTotal } = value;

        const newTotal = oriTotal;

        const inhalerEntry = await InhalerModel.create({
            user: req.auth.id,
            inhalerName,
            oriTotal , // Fixed total puffs
            newTotal, 
        });

        res.status(201).json({
            message: `Inhaler "${inhalerName}" added with ${oriTotal} total puffs.`,
            inhaler: inhalerEntry
        });
    } catch (error) {
        next(error);
    }
};




export const deletePuffUsage = async (req, res, next) => {
    try {
        const deletedPuff = await InhalerModel.findOneAndDelete({
            _id: req.params.id,
            user: req.auth.id
        });

        if (!deletedPuff) {
            return res.status(404).json({ message: 'Puff usage record not found.' });
        }

        res.status(200).json({
            message: `Puff usage record deleted successfully.`,
            puffUsage: deletedPuff
        });
    } catch (error) {
        next(error);
    }
};


export const recordPuffUsage = async (req, res, next) => {
    try {
        const { error, value } = recordPuffUsageValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        const { inhalerId, puffsUsed } = value;

        // Find the inhaler based on the inhalerId
        const inhaler = await InhalerModel.findById(inhalerId);

        if (!inhaler) {
            return res.status(404).json({ message: "Inhaler not found" });
        }

        // Check if enough puffs are available in the inhaler
        if (inhaler.newTotal < puffsUsed) {
            return res.status(400).json({ message: "Not enough puffs left in the inhaler" });
        }

        // Update the remaining puffs (newTotal)
        inhaler.newTotal -= puffsUsed;

        // Save the updated inhaler document
        await inhaler.save();

        res.status(201).json({
            message: `Recorded ${puffsUsed} puff(s) used from inhaler "${inhaler.inhalerName}".`,
            remainingPuffs: inhaler.newTotal,
            originalTotalPuffs: inhaler.oriTotal // You still want to show the original total
        });
    } catch (error) {
        next(error);
    }
};


export const getInhalerDetails = async (req, res, next) => {
    try {
        // Find the inhaler by its ID and ensure it belongs to the authenticated user
        const inhaler = await InhalerModel.findOne({
            _id: req.params.inhalerId,
            user: req.auth.id
        });

        // If no inhaler is found, return a 404 error
        if (!inhaler) {
            return res.status(404).json({ message: "Inhaler not found" });
        }

        // Respond with the inhaler details, including the inhaler name and puff information
        res.status(200).json({
            message: "Inhaler details retrieved successfully.",
            inhaler: {
                inhalerName: inhaler.inhalerName,
                remainingPuffs: inhaler.newTotal,   // Remaining puffs available
                originalTotalPuffs: inhaler.oriTotal // Fixed total puffs
            }
        });
    } catch (error) {
        // Pass the error to the next middleware (error handler)
        next(error);
    }
};



export const countPuffUsage = async (req, res, next) => {
    try {
        const { filter = '{}' } = req.query;

        // Parse the filter and apply it
        const count = await InhalerModel.countDocuments({
            ...JSON.parse(filter),
            user: req.auth.id
        });

        res.status(200).json({
            message: 'Puff usage count retrieved successfully.',
            count
        });
    } catch (error) {
        next(error);
    }
};



