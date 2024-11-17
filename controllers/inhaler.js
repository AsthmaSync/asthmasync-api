import InhalerModel from '../models/inhaler.js';
import MedicationModel from '../models/medication.js';
import { puffUsageValidator } from '../validators/inhaler.js';


export const getPuffUsage = async (req, res, next) => {
    try {
        const { filter = '{}', limit = 10, skip = 0, sort = '{}' } = req.query;

        // Parse and apply filters
        const puffUsage = await InhalerModel.find({
            ...JSON.parse(filter),
            user: req.auth.id
        })
            .sort(JSON.parse(sort))
            .limit(Number(limit))
            .skip(Number(skip));

        res.status(200).json({
            message: 'Puff usage records retrieved successfully.',
            puffUsage
        });
    } catch (error) {
        next(error);
    }
};




export const addInhaler = async (req, res, next) => {
    try {
        // Validate the input
        const { error, value } = puffUsageValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: 'Invalid input.', details: error.details });
        }

        const { medication, puffs } = value;

        // Verify the medication exists and belongs to the user
        const medicationRecord = await MedicationModel.findOne({
            _id: medication,
            user: req.auth.id
        });

        if (!medicationRecord) {
            return res.status(404).json({ message: "Medication not found or doesn't belong to the user." });
        }

        // Record the puff usage
        const puffUsageEntry = await PuffUsageModel.create({
            user: req.auth.id,
            medication,
            puffs,
        });

        // Send a response with the new entry
        res.status(201).json({
            message: `Successfully recorded ${puffs} puff(s) for medication "${medicationRecord.name}".`,
            puffUsage: puffUsageEntry
        });
    } catch (error) {
        next(error);
    }
};

export const updatePuffUsage = async (req, res, next) => {
    try {
        // Validate input
        const { error, value } = puffUsageValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: 'Invalid input.', details: error.details });
        }

        const { puffs, medication } = value;

        // Find and update the puff entry
        const updatedPuff = await InhalerModel.findOneAndUpdate(
            { _id: req.params.id, user: req.auth.id },
            { puffs, medication },
            { new: true }
        );

        if (!updatedPuff) {
            return res.status(404).json({ message: 'Puff usage record not found.' });
        }

        res.status(200).json({
            message: `Puff usage updated successfully.`,
            puffUsage: updatedPuff
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


export const recordPuffUsage = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = puffUsageValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        const { inhalerId, puffsUsed } = value;

        // Find the inhaler
        const inhaler = await InhalerModel.findById(inhalerId);

        if (!inhaler) {
            return res.status(404).json({ message: "Inhaler not found" });
        }

        if (inhaler.remainingPuffs < puffsUsed) {
            return res.status(400).json({ message: "Not enough puffs left in the inhaler" });
        }

        // Update remaining puffs
        inhaler.remainingPuffs -= puffsUsed;
        await inhaler.save();

        // Record the puff usage
        const newPuffUsage = await PuffUsageModel.create({
            ...value,
            user: req.auth.id
        });

        res.status(201).json({
            message: "Puff usage recorded successfully.",
            remainingPuffs: inhaler.remainingPuffs,
            puffUsage: newPuffUsage
        });
    } catch (error) {
        next(error);
    }
};


export const getRemainingPuffs = async (req, res, next) => {
    try {
        const { inhalerId } = req.params;

        const inhaler = await InhalerModel.findOne({
            _id: inhalerId,
            user: req.auth.id
        });

        if (!inhaler) {
            return res.status(404).json({ message: "Inhaler not found" });
        }

        res.status(200).json({
            message: "Remaining puffs retrieved successfully.",
            remainingPuffs: inhaler.remainingPuffs
        });
    } catch (error) {
        next(error);
    }
};

