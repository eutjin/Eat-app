import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./context";

import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { NotificationsProvider } from "@mantine/notifications";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <NotificationsProvider>
      <GoogleOAuthProvider clientId="858348363721-rsfar8gs4qdru48a1q7fn817vpcrpi7o.apps.googleusercontent.com">

          <App /></GoogleOAuthProvider>
        </NotificationsProvider>
      </BrowserRouter>
    </AppProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
