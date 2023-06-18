import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLP50UAZ259yx2Q_Uv6z5la9nhiZBc7kI",
  authDomain: "todo-react-proj.firebaseapp.com",
  projectId: "todo-react-proj",
  storageBucket: "todo-react-proj.appspot.com",
  messagingSenderId: "833082663432",
  appId: "1:833082663432:web:89eb7fb2a387fb43cfa7bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);