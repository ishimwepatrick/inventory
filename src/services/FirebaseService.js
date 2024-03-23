import { auth } from 'auth/FirebaseAuth';
import axios from 'axios'
import { API_BASE_URL } from '../configs/AppConfig'
const FirebaseService = {}

FirebaseService.login = async (email, password) =>{
	const url = API_BASE_URL+'/verifyPassword?key=AIzaSyA51JfqMcBozyowcK7qi9m7Yg2ml2QHN9U';
	const response = await axios.post(url,{email, password}).then(user => user).catch(err => err);
	return response; 
}	
FirebaseService.signInEmailRequest = async (email, password) =>{
	await auth.signInWithEmailAndPassword(email, password).then(user => user).catch(err => err);
}	
FirebaseService.signOutRequest = async () =>{
	await auth.signOut().then(user => user).catch(err => err);
}	
FirebaseService.signUpEmailRequest = async (email, password) =>{
	await auth.createUserWithEmailAndPassword(email, password).then(user => user).catch(err => err);
}
FirebaseService.resetPasswordRequest = async (email) =>{
	await auth.sendPasswordResetEmail(email).then(response => response).catch(err => err);	
}	
export default FirebaseService