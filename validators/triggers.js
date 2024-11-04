import Joi from "joi";

export const addTriggerValidator = Joi.object({
    triggers : Joi.string().required(),
    notes: Joi.string().required(),
});

export const updateTriggerValidator = Joi.object({
    triggers : Joi.string(),
    notes: Joi.string()
});