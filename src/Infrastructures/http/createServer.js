const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const users = require('../../Interfaces/http/api/users');
const config = require('../../Commons/config');
const DomainErrorTranslator = require('../../Commons/Exceptions/DomainErrorTranslator');
const ClientError = require('../../Commons/Exceptions/ClientError');

const swaggerOptions = {
	info: {
		title: 'Auth API Documentation',
		version: '1.0.0',
	},
};

const createServer = async (container) => {
	const server = Hapi.server({
		host: config.app.host,
		port: config.app.port,
		debug: config.app.debug,
	});

	// external plugin
	await server.register([
		{
			plugin: Inert,
		},
		{
			plugin: Vision,
		},
		{
			plugin: HapiSwagger,
			options: swaggerOptions,
		},
	]);

	await server.register([
		{
			plugin: users,
			options: { container },
		},
	]);

	server.route({
		method: 'GET',
		path: '/',
		handler: () => ({
			value: 'Hello world!',
		}),
	});

	server.ext('onPreResponse', (request, h) => {
		// mendapatkan konteks response dari request
		const { response } = request;

		if (response instanceof Error) {
			// bila response tersebut error, tangani sesuai kebutuhan
			const translatedError = DomainErrorTranslator.translate(response);

			// penanganan client error secara internal.
			if (translatedError instanceof ClientError) {
				const newResponse = h.response({
					status: 'fail',
					message: translatedError.message,
				});
				newResponse.code(translatedError.statusCode);

				return newResponse;
			}

			// mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
			if (!translatedError.isServer) {
				return h.continue;
			}

			// penanganan server error sesuai kebutuhan
			const newResponse = h.response({
				status: 'error',
				message: 'terjadi kegagalan pada server kami',
			});
			newResponse.code(500);

			return newResponse;
		}

		// jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
		return h.continue;
	});

	return server;
};

module.exports = createServer;
