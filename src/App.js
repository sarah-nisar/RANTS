import logo from "./logo.svg";
import "./App.css";
import SocialLogin from "@biconomy/web3-auth";
import { useCVPContext } from "./Context/CVPContext";

function App() {
	const {
		connect,
		disconnect,
		address,
		loading: eoaWalletLoading,
		registerStudent,
	} = useCVPContext();
	return (
		<div className="App">
			<header className="App-header">
				{address ? (
					<>
						<button className="border px-4 py-2 text-sm bg-white rounded-md">
							{address}
						</button>

						<button
							className="border px-4 py-2 text-sm bg-white rounded-md"
							onClick={disconnect}
						>
							Logout
						</button>
						<button onClick={registerStudent}>
							Register registerStudent
						</button>
					</>
				) : (
					<>
						<button
							color="dark"
							radius="md"
							onClick={connect}
							disabled={eoaWalletLoading}
						>
							Login
						</button>
					</>
				)}
			</header>
		</div>
	);
}

export default App;
