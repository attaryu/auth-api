require('dotenv').config();
const createServer = require('../src/Infrastructures/http/createServer');
const container = require('../src/Infrastructures/container');

let server;

const initServer = async () => {
	if (!server) {
		server = await createServer(container);
		await server.initialize();
	}

	return server;
};

module.exports = async (req, res) => {
	try {
		const hapiServer = await initServer();

		const response = await hapiServer.inject({
			method: req.method,
			url: req.url,
			headers: req.headers,
			payload: req.body,
		});

		res.statusCode = response.statusCode;

		Object.keys(response.headers).forEach((key) => {
			res.setHeader(key, response.headers[key]);
		});

		res.end(response.payload);
	} catch (error) {
		console.error('Error:', error);
		res.statusCode = 500;
		res.end(JSON.stringify({ error: 'Internal Server Error' }));
	}
};
