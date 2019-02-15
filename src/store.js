import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

const firebaseConfig = {
	apiKey: 'AIzaSyAzs4t_7K6X7cX_iawOn8e8U52Qw88oSWE',
	authDomain: 'reactpractice-9fab0.firebaseapp.com',
	databaseURL: 'https://reactpractice-9fab0.firebaseio.com',
	projectId: 'reactpractice-9fab0',
	storageBucket: 'reactpractice-9fab0.appspot.com',
	messagingSenderId: '716570060510',
};

// react-redux-firebase config
const rrfConfig = {
	userProfile: 'users',
	useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);
// Init firestore
const firestore = firebase.firestore();
// const settings = { timestampsInSnapshots: true };
// firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
	reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
	reduxFirestore(firebase),
)(createStore);

const rootReducer = combineReducers({
	firebase: firebaseReducer,
	firestore: firestoreReducer,
	notify: notifyReducer,
	settings: settingsReducer,
});

//check for settings in local storage
if (localStorage.getItem('settings') == null) {
	//Default settings
	const defaultSettings = {
		disableBalanceOnAdd: true,
		disableBalanceOnEdit: false,
		allowRegistration: false,
	};
	//Set to loacal storage
	localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

const initialState = { settings: JSON.parse(localStorage.getItem('settings')) };
// Create store
const store = createStoreWithFirebase(
	rootReducer,
	initialState,
	compose(
		reactReduxFirebase(firebase),
		window.__REDUX_DEVTOOLS_EXTENSION__ &&
			window.__REDUX_DEVTOOLS_EXTENSION__(),
	),
);

export default store;
