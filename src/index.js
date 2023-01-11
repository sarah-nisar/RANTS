import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CVPProvider } from "./Context/CVPContext";
import "@biconomy/web3-auth/dist/src/style.css";
import { SmartAccountProvider } from "./Context/SmartAccountContext";
import { Web3AuthProvider } from "./Context/SocialLoginContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Web3AuthProvider>
			<SmartAccountProvider>
				<App />
			</SmartAccountProvider>
		</Web3AuthProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
