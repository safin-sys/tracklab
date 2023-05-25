import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDCH3vtXWa4JhJo5Jgd2OYEy9l6caJB7y4",
    authDomain: "tracklab-d4284.firebaseapp.com",
    projectId: "tracklab-d4284",
    storageBucket: "tracklab-d4284.appspot.com",
    messagingSenderId: "49717194034",
    appId: "1:49717194034:web:d15c07f20364f6163bbb2b",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
