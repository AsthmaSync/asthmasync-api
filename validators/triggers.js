import Joi from "joi";

export const addTriggerValidator = Joi.object({
    title : Joi.string().required().min(1),
    notes: Joi.string().required().min(5),
    date :Joi.date().max('now')
});

export const updateTriggerValidator = Joi.object({
    title : Joi.string().min(1),
    notes: Joi.string().min(5),
    date :Joi.date().max('now')
});

