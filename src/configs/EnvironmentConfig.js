const dev = {
  API_ENDPOINT_URL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
};

const prod = {
  API_ENDPOINT_URL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
};

const test = {
  API_ENDPOINT_URL: 'https://api.test.com'
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()