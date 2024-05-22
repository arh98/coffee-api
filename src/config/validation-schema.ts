import * as Joi from 'joi';

export default Joi.object({
    DB_NAME: Joi.string(),
    DB_HOST: Joi.string(),
    DB_PORT: Joi.number().port().default(5432),
    DB_USERNAME: Joi.string(),
    DB_PASSWD: Joi.string(),
});
