import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBUnhxHBFK_fIBBuEu4p1LCXBSuxIMB8NM",
    authDomain: "ddock-ddock.firebaseapp.com",
    projectId: "ddock-ddock",
    storageBucket: "ddock-ddock.appspot.com",
    messagingSenderId: "212572232674",
    appId: "1:212572232674:web:ad7d41106c12981030f7bb"
  };

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp };
