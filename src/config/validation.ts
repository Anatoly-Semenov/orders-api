import * as Joi from 'joi'

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test'),
	PORT: Joi.number().default(3000),
	DB_TYPE: Joi.string().required(),
	DB_HOST: Joi.string().required(),
})
