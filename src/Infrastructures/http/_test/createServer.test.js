const createServer = require('../createServer');

describe('HTTP server', () => {
	let server;

	beforeAll(async () => {
		server = await createServer({});
	});

	it('should response 404 when request unregistered route', async () => {
		// Action
		const response = await server.inject({
			method: 'GET',
			url: '/unregisteredRoute',
		});

		// Assert
		expect(response.statusCode).toEqual(404);
	});

	it('should handle server error correctly', async () => {
		// Arrange
		const requestPayload = {
			username: 'dicoding',
			fullname: 'Dicoding Indonesia',
			password: 'super_secret',
		};

		// Action
		const response = await server.inject({
			method: 'POST',
			url: '/users',
			payload: requestPayload,
		});

		// Assert
		const responseJson = JSON.parse(response.payload);
		expect(response.statusCode).toEqual(500);
		expect(responseJson.status).toEqual('error');
		expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
	});

	describe('when GET /', () => {
		it('should return 200 and hello world', async () => {
			// Action
			const response = await server.inject({
				method: 'GET',
				url: '/',
			});

			// Assert
			const responseJson = JSON.parse(response.payload);
			expect(response.statusCode).toEqual(200);
			expect(responseJson.value).toEqual('Hello world!');
		});
	});
});
