import Joi from "joi";

export const registerUserValidator = Joi.object({
    name :Joi.string().required(),
    email :Joi.string().required(),
    password :Joi.string().required(),

});

export const loginUserValidator = Joi.object({
    email :Joi.string().required(),
    password: Joi.string().required(),
});

export const updateUserValidator = Joi.object ({
    name:Joi.string(),
    avatar:Joi.string(),
    email :Joi.string().required(),
    password: Joi.string().required(),

});