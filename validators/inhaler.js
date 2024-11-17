import Joi from 'joi';



export const addInhalerValidator = Joi.object({
    inhalerName: Joi.string().required(),
    oriTotal: Joi.number().min(1).required()
});



export const recordPuffUsageValidator = Joi.object({
    inhalerName: Joi.string().required(),
    // inhalerId: Joi.string(),
    puffsUsed: Joi.number().min(1).required()
});
