import Joi from "joi";


export const addMedicationValidator = Joi.object ({
    name : Joi.string().required(),
    dosage : Joi.string().required(),
    frequency : Joi.string().required(),
    startDate : Joi.string().required(),
    endDate : Joi.string().required(),
    purpose : Joi.string().required(),
    taken : Joi.string().required(),
    dosageTaken : Joi.string().required()

});

export const updateMedicationValidator = Joi.object ({
    name : Joi.string(),
    dosage : Joi.string(),
    frequency : Joi.string(),
    startDate : Joi.string(),
    endDate : Joi.string(),
    purpose : Joi.string(),
    taken : Joi.string(),
    dosageTaken : Joi.string()

});