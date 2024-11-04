import Joi from "joi";

export const addSymptomValidator = Joi.object({
    symptoms : Joi.string().required(),
    notes : Joi.string().required(),


});

export const updateSymptomValidator = Joi.object ({
    symptoms: Joi.string(),
    notes: Joi.string(),
    

})