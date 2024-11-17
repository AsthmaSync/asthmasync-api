import Joi from 'joi';

export const puffUsageValidator = Joi.object({
    medication: Joi.string().required(), // Medication ID
    puffs: Joi.number().integer().positive().required() // Number of puffs
});


export const updatePuffValidator = Joi.object({
    medication: Joi.string().required(), // Medication ID
    puffs: Joi.number().integer().positive().required() // Number of puffs
});
