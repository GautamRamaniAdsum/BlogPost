const Joi = require("joi")

async function validateCreateBlog(data) {
    const Schema = Joi.object({
        title: Joi.string().required(),
        post: Joi.string().required(),
        author: Joi.string()
    });
    const { error, value } = Schema.validate(data);
    return { error, value }
}

async function validateUpdateBlog(data) {
    const Schema = Joi.object({
        title: Joi.string(),
        post: Joi.string(),
        author: Joi.string()
    });
    const { error, value } = Schema.validate(data);
    return { error, value }
}

async function validateRemoveBlog(data) {
    const Schema = Joi.object({
        title: Joi.string().required(),
    });
    const { error, value } = Schema.validate(data);
    return { error, value }
}

module.exports = { validateCreateBlog, validateUpdateBlog, validateRemoveBlog }