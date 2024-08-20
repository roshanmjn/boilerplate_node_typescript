import Joi from "joi";

export const createPlayerDto = Joi.object({
    nickname: Joi.string().required(),
    team_id: Joi.number().required(),
    first_name: Joi.string().required(),
    middle_name: Joi.string().optional(),
    last_name: Joi.string().required(),
    squad_number: Joi.number().optional(),
    squad_role: Joi.string().optional(),
    email: Joi.string().email().required(),
    age: Joi.number().optional(),
    height: Joi.number().positive().precision(2).optional(),
    profile_picture: Joi.string().optional(),
});

export const updatePlayerDto = Joi.object({
    nickname: Joi.string().optional(),
    team_id: Joi.number().optional(),
    first_name: Joi.string().optional(),
    middle_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    squad_number: Joi.number().optional(),
    squad_role: Joi.string().optional(),
    email: Joi.string().email().optional(),
    age: Joi.number().optional(),
    height: Joi.number().positive().precision(2).optional(),
    profile_picture: Joi.string().optional(),
});

export const playerId = Joi.object({
    id: Joi.number().required(),
});
