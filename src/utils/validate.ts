import Joi from 'joi';
import { isValidUUID } from './common';

export const patterns = {
    sort: /^\{"([a-zA-Z][a-zA-Z0-9.]{1,150}[a-zA-Z0-9])":(-?1)(,"([a-zA-Z][a-zA-Z0-9.]{1,150}[a-zA-Z0-9])":(-?1))*\}$/,
};

export const joi = Joi.extend(joi => {
    return {
        type: 'uuid',
        base: joi.string(),
        rules: {
            isValid: {
                alias: 'valid',
                method() {
                    return this.$_addRule('isValid');
                },
                validate(value, helpers) {
                    if (!isValidUUID(value)) {
                        return helpers.error('uuid.isValid');
                    }
                    return value;
                },
            },
        },
    };
});

export const commonValidations = {
    uuid: joi.uuid().valid().required(),
    country: joi.string().trim().required(),
    page: joi.number().integer().min(1).required(),
    perPage: joi.number().integer().min(1).required(),
    sort: joi.string().trim().regex(patterns.sort, 'sortPattern').required(),
};
