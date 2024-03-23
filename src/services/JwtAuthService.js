import fetch from 'auth/FetchInterceptor'

const JwtAuthService = {}

JwtAuthService.login = function (data) {
	return fetch({
		url: '/verifyPassword?key=AIzaSyDdIbxcx6vzlt6xkrU3fiaAM29h61f_Zps',
		method: 'post',
		headers: {
      'public-request': 'true'
    },
		data: data
	})
}

JwtAuthService.signUp = function (data) {
	return fetch({
		url: '/auth/signup',
		method: 'post',
		headers: {
      'public-request': 'true'
    },
		data: data
	})
}

export default JwtAuthService