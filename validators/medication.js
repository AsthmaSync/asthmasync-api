import Joi from "joi";


export const addMedicationValidator = Joi.object ({
    name : Joi.string().required(),
    dosage : Joi.string().required(),
    frequency : Joi.string().required().valid('daily', 'weekly', 'monthly'),
    startDate : Joi.date().required(),
    endDate : Joi.date().greater(Joi.ref("startDate")),
    purpose : Joi.string().required().valid('preventive', 'reliever')
    
});

export const updateMedicationValidator = Joi.object ({
    name : Joi.string(),
    dosage : Joi.string(),
    frequency : Joi.string().valid('daily', 'weekly', 'monthly'),
    startDate : Joi.date(),
    endDate : Joi.date().greater(Joi.ref("startDate")),
    purpose : Joi.string().valid('preventive', 'reliever'),
    taken : Joi.boolean().required(),
    dosageTaken : Joi.number().min(0).required(),

});