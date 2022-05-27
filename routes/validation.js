import Joi from "joi";

const registerValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().min(6).required(),
		password: Joi.string().min(6).required(),
		email: Joi.string().min(6).required().email(),
		roles: Joi.string().required(),
	});
	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};

const checkLogin = (req, res, next) => {
	// ngecheck local storage kalo ada berarti bisa login kalo gak ada berarti balik ke page login
};

export { registerValidation, loginValidation };
