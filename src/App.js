import logo from "./logo.svg";
import "./App.css";
import SocialLogin from "@biconomy/web3-auth";
import { useCVPContext } from "./Context/CVPContext";
import { useWeb3AuthContext } from "./Context/SocialLoginContext";
import { useSmartAccountContext } from "./Context/SmartAccountContext";
import Button from "./components/Button";
import SingleTransaction from "./Context/SingleTransaction";

function App() {
	const {
		address,
		loading: eoaLoading,
		userInfo,
		connect,
		disconnect,
		getUserInfo,
	} = useWeb3AuthContext();
	const {
		selectedAccount,
		loading: scwLoading,
		setSelectedAccount,
	} = useSmartAccountContext();

	console.log("address", address);

	return (
		<div>
			<main>
				<h1>Biconomy SDK React Web3Auth Example</h1>
				<Button
					onClickFunc={
						!address
							? connect
							: () => {
									setSelectedAccount(null);
									disconnect();
							  }
					}
					title={!address ? "Connect Wallet" : "Disconnect Wallet"}
				/>

				{eoaLoading && <h2>Loading EOA...</h2>}

				{address && (
					<div>
						<h2>EOA Address</h2>
						<p>{address}</p>
					</div>
				)}

				{scwLoading && <h2>Loading Smart Account...</h2>}

				{selectedAccount && address && (
					<div>
						<h2>Smart Account Address</h2>
						<p>{selectedAccount.smartAccountAddress}</p>
					</div>
				)}

				{address && (
					<>
						<Button
							onClickFunc={() => getUserInfo()}
							title="Get User Info"
						/>
						<SingleTransaction />
					</>
				)}

				{userInfo && (
					<div style={{ maxWidth: 800, wordBreak: "break-all" }}>
						<h2>User Info</h2>
						<pre style={{ whiteSpace: "pre-wrap" }}>
							{JSON.stringify(userInfo, null, 2)}
						</pre>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
