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

        const { inhalerName, totalPuffs } = value;

        const inhalerEntry = await InhalerModel.create({
            user: req.auth.id,
            inhalerName,
            newTotal, // Remaining puffs
            oriTotal: totalPuffs // Fixed total
        });

        res.status(201).json({
            message: `Inhaler "${inhalerName}" added with ${totalPuffs} total puffs.`,
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

        const inhaler = await InhalerModel.findById(inhalerId);

        if (!inhaler) {
            return res.status(404).json({ message: "Inhaler not found" });
        }

        if (inhaler.newTotal < puffsUsed) {
            return res.status(400).json({ message: "Not enough puffs left in the inhaler" });
        }

        // Update total puffs
        inhaler.newTotal -= puffsUsed;
        await inhaler.save();

        res.status(201).json({
            message: `Recorded ${puffsUsed} puff(s) used from inhaler "${inhaler.inhalerName}".`,
            remainingPuffs: inhaler.newTotal,
            originalTotalPuffs: inhaler.oriTotal
        });
    } catch (error) {
        next(error);
    }
};



export const getInhalerDetails = async (req, res, next) => {
    try {
        const inhaler = await InhalerModel.findOne({
            _id: req.params.inhalerId,
            user: req.auth.id
        });

        if (!inhaler) {
            return res.status(404).json({ message: "Inhaler not found" });
        }

        res.status(200).json({
            message: "Inhaler details retrieved successfully.",
            inhaler: {
                inhalerName: inhaler.inhalerName,
                remainingPuffs: inhaler.newTotal,
                originalTotalPuffs: inhaler.oriTotal
            }
        });
    } catch (error) {
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



