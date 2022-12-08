import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, Firestore, Timestamp, collection, doc, CollectionReference, DocumentData, DocumentReference } from 'firebase/firestore';
import { Collections } from "./Collections";

// console.log("project id: ;::: ", import.meta.env.VITE_APP_API, import.meta.env.API);


const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    databaseURL: import.meta.env.VITE_databaseURL,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
};
const app = initializeApp(firebaseConfig)
const DB: Firestore = getFirestore(app)

export const createDoc = <T = DocumentData>(collectionName: Collections, id: string) => {
    return doc(DB, collectionName, id) as DocumentReference<T>
}

export const updateChildDoc = <T = DocumentData>(collectionName: string, id: string) => {
    return doc(DB, collectionName, id) as DocumentReference<T>
}

export const createCollection = <T = DocumentData>(collectionName: string): CollectionReference<T> => {
    return collection(DB, collectionName) as CollectionReference<T>
}