class RegisterUser {
	constructor({ username, password, fullname }) {
		this._verivyPayload({ username, password, fullname });

		this.username = username;
		this.password = password;
		this.fullname = fullname;
	}

	_verivyPayload({ username, password, fullname }) {
		if (!username || !password || !fullname) {
			throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (
			typeof username !== 'string' ||
			typeof password !== 'string' ||
			typeof fullname !== 'string'
		) {
			throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
		}

		if (username.length > 50) {
			throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
		}

		if (!username.match(/^[a-zA-Z1-9_]+$/)) {
			throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
		}
	}
}

module.exports = RegisterUser;
