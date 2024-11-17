import Joi from 'joi';



export const addInhalerValidator = Joi.object({
    inhalerName: Joi.string().required(), // Name of the inhaler
    oriTotal: Joi.number().min(1).required(), // Original total puffs
    newTotal: Joi.number().min(1).required() // Remaining puffs (starts the same as oriTotal)
});




export const recordPuffUsageValidator = Joi.object({
    inhalerId: Joi.string().required(),  // Validate inhalerId to identify which inhaler the puffs are used from
    puffsUsed: Joi.number().min(1).required()  // Validate the number of puffs used (must be at least 1)
});
