import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { db } from 'auth/FirebaseAuth';
import DB from 'services/db';
import { sha256 } from 'js-sha256';
import {
	SIGNIN,
	SIGNOUT,
	SIGNUP,
	RESET_PASSWORD
} from '../constants/Auth';
import {
	showSuccessMessage,
	showAuthMessage,
	authenticated,
	signOutSuccess,
	resetPassword
} from "../actions/Auth";

import FirebaseService from 'services/FirebaseService'

export function* signInWithFBEmail() {
  yield takeEvery(SIGNIN, function* ({payload}) {
		const {email, password} = payload;
		try {
			const user = yield call(FirebaseService.login, email, password);
			if (user && user.message) {
				if(user.message === "Request failed with status code 400"){
					yield put(showAuthMessage("Invalid email or password"));
				}
				else if(user.message === "Network Error"){
					const data = yield call(getOfflineData, email);
					if(data && data.key !== sha256(password)){
						yield put(showAuthMessage("Invalid email or password"));
					}
					else if(!data){
						yield put(showAuthMessage("Invalid email address!"));
					}
					else{
						//localStorage.setItem(AUTH_TOKEN, data.userId);
						yield put(authenticated(data.userId, data));
					}
				}
			} else{
				const settingData = yield call(getSettings);
				const memberData = yield call(getUserData, email);
				if(!memberData && user.data.email !== 'admin@system.com'){
					yield put(showAuthMessage('Unauthorized email account'));
				}
				else if(memberData && !memberData.status){
					yield put(showAuthMessage('Unauthorized email account'));
					yield call(blockUser, email);
				}
				else{
					let role = memberData !== undefined ? memberData.userRole : 'System Admin';
            		let displayName = memberData !== undefined ? (memberData.name) : 'ISHIMWE Patrick';
					let userProfile = memberData !== undefined ? memberData.profile : "/img/avatars/placeholder.jpg";
					let userStore = memberData !== undefined ? memberData.userStore : "All Stores";
					//localStorage.setItem(AUTH_TOKEN, user.data.localId);
					let data = {
						userId: user.data.localId,
						role,
						userStore,
						displayName,
						email: user.data.email,
						photoURL: userProfile,
						key : password,
						settings: settingData !== undefined ? settingData.value : ''
					}
					setUserData(data)
					yield put(authenticated(user.data.localId, data));
				}
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export function* signOut() {
  yield takeEvery(SIGNOUT, function* () {
		try {
			const signOutUser = yield call(FirebaseService.signOutRequest);
			if (signOutUser === undefined) {
				//localStorage.removeItem(AUTH_TOKEN);
				yield put(signOutSuccess(signOutUser));
			} else {
				yield put(showAuthMessage(signOutUser.message));
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export function* signUpWithFBEmail() {
  yield takeEvery(SIGNUP, function* ({payload}) {
		const {email, password} = payload;
		const memberData = yield call(getUserData, email);
		console.log(memberData);
		if(!memberData)
		{
			yield put(showAuthMessage("Unauthorized email account"));
		}
		else if(!memberData.status)
		{
			yield put(showAuthMessage("Unauthorized email account"));
			yield call(blockUser, email);
		}
		else{
			try {
				const user = yield call(FirebaseService.signUpEmailRequest, email, password);
				console.log(user);
				if (user && user.message) {
					yield put(showAuthMessage(user.message));
				} else {
					yield put(showSuccessMessage("Account Created, Log in to continue!"));
				}
			} catch (error) {
				yield put(showAuthMessage(error));
			}
		}
	}
	);
}

export function* resetPasswordWithFBEmail() {
  yield takeEvery(RESET_PASSWORD, function* ({payload}) {
		const {email} = payload;
		try {
			const user = yield call(FirebaseService.resetPasswordRequest, email);
			if (user.message) {
				yield put(showAuthMessage(user.message));
			} else {
				yield put(resetPassword("Account Created, Log in to continue!"));
			}
		} catch (error) {
			yield put(showAuthMessage(error));
		}
	});
}

function getSettings(){
    return new Promise((resolve, reject) => {
      db
	  .collection("settings")
      .where("_id", "==", 'purchases')
      .get()
      .then(docList => {
        let docData;
        docList.docs.forEach(doc => {
          docData = doc.data();
        });
        resolve(docData);
      })
	  .catch(err => {
		resolve(undefined);
	  });
    })
  };

function getUserData(email){
    return new Promise((resolve, reject) => {
      db
	  .collection("employees")
      .where("email", "==", email)
      .get()
      .then(docList => {
        let docData;
        docList.docs.forEach(doc => {
          docData = doc.data();
        });
        resolve(docData);
      })
	  .catch(err => {
		resolve(undefined);
	  });
    })
  };

function setUserData(user){
	let db = new DB('users');
	if(user.key){
		let data = {
			_id : user.email,
			role : user.role,
			displayName : user.displayName,
			email : user.email,
			userStore : user.userStore,
			photoURL : user.photoURL,
			userId : user.userId,
			key : sha256(user.key)
		}
		db.getRow(user.email).then(() => db.update(user.email,data)).catch(() => db.create(data));
	}  
  } 
function blockUser(email){
	let db = new DB('users');
	if(email){
		db.delete(email).catch(()=>{});
	}  
  } 
  function getOfflineData(email){
	let db = new DB('users');  
    return new Promise((resolve, reject) => {
      db.getRow(email).then(function(data){
        resolve(data);
      }).catch(() => {
		resolve(null);
      })
    })
  };

export default function* rootSaga() {
  yield all([
		fork(signInWithFBEmail),
		fork(signOut),
		fork(signUpWithFBEmail),
		fork(resetPasswordWithFBEmail)
  ]);
}
