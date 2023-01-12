import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@biconomy/web3-auth/dist/src/style.css";
import { AuthContextProvider } from "./Context/AuthContext";
import { CVPProvider } from "./Context/CVPContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <CVPProvider>
        <App />
      </CVPProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
