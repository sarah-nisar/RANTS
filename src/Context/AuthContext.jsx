import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
	const [provider, setProvider] = useState(undefined);
	const [signer, setSigner] = useState(undefined);
	const [signerAddress, setSignerAddress] = useState(undefined);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const onLoad = async () => {
			setLoading(true);
			//@ts-ignore
			const provider = await new ethers.providers.Web3Provider(
				window.ethereum
			);
			setProvider(provider);
			setLoading(false);
		};

		onLoad();
	}, []);

	const getSigner = async (provider) => {
		provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		setSigner(signer);
	};

	const isConnected = () => signer !== undefined;

	const getWalletAddress = () => {
		signer.getAddress().then((address) => {
			setSignerAddress(address);
		});
	};

	if (signer !== undefined) {
		getWalletAddress();
	}

	return (
		<AuthContext.Provider
			value={{
				provider,
				signerAddress,
				getSigner,
				isConnected,
				getWalletAddress,
				signer,
			}}
		>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};
