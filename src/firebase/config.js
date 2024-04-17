import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBUnhxHBFK_fIBBuEu4p1LCXBSuxIMB8NM',
    authDomain: 'ddock-ddock.firebaseapp.com',
    projectId: 'ddock-ddock',
    storageBucket: 'ddock-ddock.appspot.com',
    messagingSenderId: '212572232674',
    appId: '1:212572232674:web:ad7d41106c12981030f7bb',
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
const projectAuth = firebase.auth();
const timestamp = firebase.firestore.Timestamp;
const projectStorage = firebase.storage();
const FieldValue = firebase.firestore.FieldValue

export { projectFirestore, projectAuth, timestamp, projectStorage, provider,FieldValue };
