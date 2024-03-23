import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'
import firebaseConfig from 'configs/FirebaseConfig';

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({
	cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth();
const storage = firebase.storage();
const currentUser = auth.currentUser

db.enablePersistence();


export {
	db,
	auth,
	storage,
	currentUser
};