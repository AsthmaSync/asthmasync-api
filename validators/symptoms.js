import Joi from "joi";

export const addSymptomValidator = Joi.object({
    title : Joi.string().required().min(1),
    notes : Joi.string().required().min(5),
    date: Joi.date().required().max('now')


});

export const updateSymptomValidator = Joi.object ({
    title : Joi.string().min(1),
    notes : Joi.string().min(5) 

})