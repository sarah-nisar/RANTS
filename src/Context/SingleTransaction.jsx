import React from "react";
import { ethers } from "ethers";
import { BigNumber, Wallet as EOAWallet } from "ethers";
import Wenb3Model from "web3modal";

import Button from "../components/Button";
import { useWeb3AuthContext } from "./SocialLoginContext";
import { useSmartAccountContext } from "./SmartAccountContext";
import { JsonRpcProvider } from "@ethersproject/providers";

import { CVPAddress, CvpABI } from "./constants";

export const getEOAWallet = (privateKey, provider) => {
	// defaults
	if (!provider) {
		provider = "https://rpc.ankr.com/polygon_mumbai";
	}

	const wallet = new EOAWallet(privateKey);

	if (typeof provider === "string") {
		return wallet.connect(new JsonRpcProvider(provider));
	} else {
		return wallet.connect(provider);
	}
};

const SingleTransaction = () => {
	const { ethersProvider: web3Provider } = useWeb3AuthContext();
	const { state: walletState, wallet } = useSmartAccountContext();

	const makeTx = async () => {
		if (!wallet || !walletState || !web3Provider) return;
		try {
			let smartAccount = wallet;
			console.log("AA single txn");
			console.log("smartAccount.address ", smartAccount.address);
			// const web3Modal = new Wenb3Model();
			// const connection = await web3Modal.connect();
			// const provider = new ethers.providers.Web3Provider(connection);

			// console.log(web3Provider);

			// const signer = provider.getSigner();
			// console.log(await signer.getAddress());
			// const cvpContract1 = new ethers.Contract(
			// 	CVPAddress,
			// 	CvpABI,
			// 	signer
			// );

			// console.log(await cvpContract1.retrieve());
			// const signer = web3Provider.getSigner();
			const signer = web3Provider.getSigner();
			const cvpContract = new ethers.Contract(
				CVPAddress,
				CvpABI,
				web3Provider
				// web3Provider.getSigner()
			);
			console.log(ethers.BigNumber.from("0"));
			const approveUSDCTx = await cvpContract.populateTransaction.store(
				ethers.BigNumber.from("0"),
				{
					from: smartAccount.address,
				}
			);
			const approveUSDCTx1 =
				await cvpContract.populateTransaction.retrieve();

			// console.log(await cvpContract.retrieve());
			// return;
			// console.log(approveUSDCTx1);
			const tx1 = {
				to: CVPAddress,
				data: approveUSDCTx1.data,
			};

			const txResponse = await smartAccount.sendGaslessTransaction({
				transaction: tx1,
			});
			console.log("tx response");
			console.log(txResponse); // Note! : for AA this will actually be a request id
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<main>
			<p style={{ color: "#7E7E7E" }}>
				Use Cases {"->"} Gasless {"->"} USDC Approve
			</p>

			<h3>Approve USDC Gasless Flow</h3>

			<p style={{ marginBottom: 30 }}>
				This is an example gasless transaction to approve USDC.
			</p>

			<Button title="Make transaction" onClickFunc={makeTx} />
		</main>
	);
};

export default SingleTransaction;
