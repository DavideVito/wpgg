import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { FirebaseAppProvider } from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyABijJ4_GPVVUJ-DIRNNIwWSbeMuptgD_A",
  authDomain: "wpgg-51379.firebaseapp.com",
  projectId: "wpgg-51379",
  storageBucket: "wpgg-51379.appspot.com",
  messagingSenderId: "1058137277593",
  appId: "1:1058137277593:web:1ae9d02aa1338c08d42408",
  measurementId: "G-ZZ9QX7BEJ1",
};

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
