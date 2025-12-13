require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

let server;

if (process.env.NODE_ENV !== 'production') {
	const start = async () => {
		const server = await createServer(container);
		await server.start();
		console.log(`server start at ${server.info.uri}`);
	};

	start();
} else {
	const initServer = async () => {
		if (!server) {
			server = await createServer(container);
			await server.initialize();
		}

		return server;
	};

	module.exports = async (req, res) => {
		const hapiServer = await initServer();

		const { rawPayload, ...rest } = req;

		const response = await hapiServer.inject({
			method: req.method,
			url: req.url,
			headers: req.headers,
			payload: rawPayload || req.body,
			...rest,
		});

		res.statusCode = response.statusCode;

		Object.keys(response.headers).forEach((key) => {
			res.setHeader(key, response.headers[key]);
		});

		res.end(
			response.result ? JSON.stringify(response.result) : response.payload
		);
	};
}
