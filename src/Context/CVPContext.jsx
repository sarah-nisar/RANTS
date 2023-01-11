import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import SocialLogin from "@biconomy/web3-auth";
import { activeChainId, CvpABI, CVPAddress } from "./constants";
import { useCallback } from "react";
import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(CVPAddress, CvpABI, signerOrProvider);

let options = {
	activeNetworkId: ChainId.POLYGON_MUMBAI,
	supportedNetworksIds: [
		ChainId.GOERLI,
		ChainId.POLYGON_MAINNET,
		ChainId.POLYGON_MUMBAI,
	],
	networkConfig: [
		{
			chainId: ChainId.POLYGON_MUMBAI,
			dappAPIKey: "59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3",
		},
	],
};

// this provider is from the social login which we created in last setup

export const CVPContext = React.createContext();

export const useCVPContext = () => useContext(CVPContext);

export const CVPProvider = ({ children }) => {
	const [socialLoginSDK, setSocialLoginSDK] = useState(null);
	const [smartAccount, setSmartAcount] = useState(null);
	const [web3State, setWeb3State] = useState({
		provider: null,
		web3Provider: null,
		ethersProvider: null,
		address: "",
		chainId: activeChainId,
	});

	const [accountDetails, setAccountDetails] = useState({});

	const [loading, setLoading] = useState(false);

	const { provider, web3Provider, ethersProvider, address, chainId } =
		web3State;

	console.log("Hello");

	const connectingWithSmartContract = async () => {
		try {
			const web3Provider = new ethers.providers.Web3Provider(
				socialLoginSDK.provider
			);
			const signer = web3Provider.getSigner();
			const contract = fetchContract(signer);
			return contract;
		} catch (error) {
			console.log("Something went wrong while connecting with contract!");
		}
	};

	// Create socialloginsdk and call the init
	useEffect(() => {
		const initWallet = async () => {
			const sdk = new SocialLogin();
			await sdk.init();
			sdk.showWallet();
			setSocialLoginSDK(sdk);
		};
		if (!socialLoginSDK) initWallet();
	}, [socialLoginSDK]);

	// if wallet connected close widget
	useEffect(() => {
		console.log("hidelwallet");
		if (socialLoginSDK && address) {
			socialLoginSDK.hideWallet();
		}
	}, [address, socialLoginSDK]);

	const connect = useCallback(async () => {
		if (address) return;
		if (socialLoginSDK?.provider) {
			setLoading(true);

			const web3Provider = new ethers.providers.Web3Provider(
				socialLoginSDK.provider
			);
			const signer = web3Provider.getSigner();
			const gotAccount = await signer.getAddress();
			const network = await web3Provider.getNetwork();

			let newSmartAccount = new SmartAccount(web3Provider, options);
			newSmartAccount = await newSmartAccount.init();

			setWeb3State({
				provider: socialLoginSDK.provider,
				web3Provider: web3Provider,
				ethersProvider: web3Provider,
				address: gotAccount,
				chainId: Number(network.chainId),
			});

			setSmartAcount(newSmartAccount);

			setLoading(false);
			return;
		}
		if (socialLoginSDK) {
			socialLoginSDK.showWallet();
			return socialLoginSDK;
		}

		setLoading(true);
		const sdk = new SocialLogin();
		await sdk.init();
		sdk.showWallet();
		setSocialLoginSDK(sdk);
		setAccountDetails(await sdk.getUserInfo());

		// TODO: register user if new or fetch user details from contract
		let newSmartAccount = new SmartAccount(provider, options);
		newSmartAccount = await newSmartAccount.init();
		setSmartAcount(newSmartAccount);

		setLoading(false);
		return socialLoginSDK;
	}, [address, socialLoginSDK, provider]);

	useEffect(() => {
		(async () => {
			if (socialLoginSDK?.provider && !address) {
				connect();
			}
		})();
	}, [address, connect, socialLoginSDK, socialLoginSDK?.provider]);

	useEffect(() => {
		const interval = setInterval(async () => {
			if (address) {
				clearInterval(interval);
			}
			if (socialLoginSDK?.provider && !address) {
				connect();
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [address, connect, socialLoginSDK]);

	const disconnect = useCallback(async () => {
		if (!socialLoginSDK || !socialLoginSDK.web3auth) {
			console.error("Web3Modal not initialized.");
			return;
		}
		await socialLoginSDK.logout();
		setSmartAcount(null);
		setWeb3State({
			provider: null,
			web3Provider: null,
			ethersProvider: null,
			address: "",
			chainId: activeChainId,
		});
		socialLoginSDK.hideWallet();
	}, [socialLoginSDK]);

	const registerStudent = async () => {
		const contract = await connectingWithSmartContract();
		try {
			console.log("Hello");
			// One needs to prepare the transaction data
			// Here we will be transferring ERC 20 tokens from the Smart Contract Wallet to an address
			const registerInterface = new ethers.utils.Interface([
				"function registerStudent(string memory name, string memory studentId, string memory emailId, string memory mobileNo)",
			]);

			console.log(web3State);
			// Encode an ERC-20 token transfer to recipientAddress of the specified amount
			const encodedData = registerInterface.encodeFunctionData(
				"registerStudent",
				["Ankit", "191070081", "jankitbb@gmail.com", "7977005251"]
			);

			let newSmartAccount = new SmartAccount(web3Provider, options);

			console.log(newSmartAccount);
			newSmartAccount = await newSmartAccount.init();

			const tx = {
				to: CVPAddress, // destination smart contract address
				data: encodedData,
			};

			newSmartAccount.on("txHashGenerated", (response) => {
				console.log(
					"txHashGenerated event received via emitter",
					response
				);
			});
			newSmartAccount.on("onHashChanged", (response) => {
				console.log(
					"onHashChanged event received via emitter",
					response
				);
			});
			// Event listener that gets triggered once a transaction is mined
			newSmartAccount.on("txMined", (response) => {
				console.log("txMined event received via emitter", response);
			});
			newSmartAccount.on("error", (response) => {
				console.log("error event received via emitter", response);
			});

			// Sending gasless transaction
			const txResponse = await newSmartAccount.sendGaslessTransaction({
				transaction: tx,
			});
			console.log("tx hash generated", txResponse.hash);

			const receipt = await txResponse.wait();
			console.log("tx receipt", receipt);
		} catch (err) {
			console.log(err);
		}
	};

	const registerStudent1 = async () => {
		const contract = await connectingWithSmartContract();
		try {
			console.log("ehlo");
			const res = await contract.registerStudent(
				"ANkit",
				"191070081",
				"jankitbb@gmail.com",
				"7977005251"
			);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<CVPContext.Provider
			value={{
				connect,
				disconnect,
				loading,
				provider: provider,
				ethersProvider: ethersProvider || null,
				web3Provider: web3Provider || null,
				chainId: chainId || 0,
				address: address || "",
				registerStudent,
				registerStudent1,
			}}
		>
			{children}
		</CVPContext.Provider>
	);
};
