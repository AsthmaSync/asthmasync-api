import Joi from 'joi';



export const addInhalerValidator = Joi.object({
    inhalerName: Joi.string().required(),
    oriTotal: Joi.number().min(1).required(),  // Validate the fixed total puffs
});





export const recordPuffUsageValidator = Joi.object({
    inhalerId: Joi.string().required(),  // Validate inhalerId to identify which inhaler the puffs 
    puffsUsed: Joi.number().min(1).required()  // Validate the number of puffs used (must be at least 1)
});
