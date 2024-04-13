
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
 import { getFirestore,collection,doc,addDoc,getDoc,getDocs,setDoc,updateDoc,arrayUnion,FieldValue,onSnapshot} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firestore-app.js";
import {getAuth,signOut} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {get,set,push,update} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js"
// import {get,set,getDatabase,ref,push,child,update,orderByKey} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyBVNsBWmN00s5DeyNQyXfCQXEg9UIHIlmc",
    authDomain: "quiz-web-app-2162d.firebaseapp.com",
    projectId: "quiz-web-app-2162d",
    storageBucket: "quiz-web-app-2162d.appspot.com",
    messagingSenderId: "365017866698",
    appId: "1:365017866698:web:d8ace72f9be15a54cd2f33",
    databaseURL:"https://quiz-web-app-2162d-default-rtdb.firebaseio.com/"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const database = getDatabase(app)
export {collection,doc,addDoc,getDoc,getDocs,setDoc,get,updateDoc,arrayUnion,FieldValue,set,push,onSnapshot,update,signOut};
// export const firebase = firebase();

