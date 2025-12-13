const Joi = require('joi');

const routes = (handler) => [
	{
		method: 'POST',
		path: '/users',
		handler: handler.postUserHandler,
		options: {
			description: 'Create a new user',
			tags: ['api', 'users'],
			validate: {
				payload: Joi.object({
					username: Joi.string().required().example('johndoe'),
					password: Joi.string().required().example('secretpassword'),
					fullname: Joi.string().required().example('John Doe'),
				}).label('CreateUserPayload'),
			},
			response: {
				schema: Joi.object({
					status: 'success',
					data: {
						addedUser: {
							id: Joi.string().example('user-12345'),
							username: Joi.string().example('johndoe'),
							fullname: Joi.string().example('John Doe'),
						},
					},
				}).label('CreateUserResponse'),
			},
		},
	},
];

module.exports = routes;
