import {
	//AUTH_TOKEN,
	AUTHENTICATED,
	SHOW_AUTH_MESSAGE,
	HIDE_AUTH_MESSAGE,
	SHOW_SUCCESS_MESSAGE,
	HIDE_SUCCESS_MESSAGE,
	SIGNOUT_SUCCESS,
	SIGNUP_SUCCESS,
	SHOW_LOADING,
	RESET_PASSWORD
} from '../constants/Auth';

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  showSuccess: false,
  redirect: '',
  token: null,
  userData : {
	  userStore: '',
	  role: '',
	  displayName: '',
	  email: '',
	  photoURL: '',
	  userId:'',
	  settings: ''
  }
}

const auth = (state = initState, action) => {
	switch (action.type) {
		case AUTHENTICATED:
			return {
				...state,
				loading: false,
				redirect: '/',
				token: action.token,
				userData : {
					userStore: action.userData.userStore,
					role: action.userData.role,
					displayName: action.userData.displayName,
					email: action.userData.email,
					photoURL: action.userData.photoURL,
					userId: action.userData.userId,
					settings: action.userData.settings
				}
			}
		case SHOW_AUTH_MESSAGE: 
			return {
				...state,
				message: action.message,
				showMessage: true,
				loading: false
			}
		case RESET_PASSWORD: 
			return {
				...state,
				message: action.message,
				showMessage: true,
				loading: false
			}
		case HIDE_AUTH_MESSAGE: 
			return {
				...state,
				message: '',
				showMessage: false,
			}
		case SHOW_SUCCESS_MESSAGE: 
			return {
				...state,
				redirect: '/',
				message: action.message,
				showSuccess: true,
				loading: false
			}
		case HIDE_SUCCESS_MESSAGE: 
			return {
				...state,
				message: '',
				showSuccess: false,
			}	
		case SIGNOUT_SUCCESS: {
			return {
				...state,
				token: null,
				redirect: '/',
				loading: false,
				userData : {
					userStore: '',
					role: '',
					displayName: '',
					email: '',
					photoURL: '',
					userId: '',
					settings: ''
				}
			}
		}
		case SIGNUP_SUCCESS: {
			return {
			  ...state,
			  loading: false,
			  token: action.token
			}
		}
		case SHOW_LOADING: {
			return {
				...state,
				loading: true
			}
		}
		default:
			return state;
	}
}

export default auth