import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import { activeChainId, CvpABI, CVPAddress } from "./constants";
import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";
import { useAuth } from "./AuthContext";

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(CVPAddress, CvpABI, signerOrProvider);

const options = {
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

export const CVPContext = React.createContext();

export const useCVPContext = () => useContext(CVPContext);

export const CVPProvider = ({ children }) => {
	const { provider, signerAddress, signer } = useAuth();

	const connectingWithSmartContract = async () => {
		fetchContract(signer);
	};

	const registerStudent = async (
		name,
		emailId,
		address,
		mobileNo,
		studentId
	) => {
		const contract = fetchContract(signer);

		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("registerStudent", [
			name,
			studentId,
			emailId,
			mobileNo,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGasLessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const registerStaff = async (name, department, emailId, level) => {
		const contract = fetchContract(signer);

		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("registerStaff", [
			name,
			department,
			emailId,
			level,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGasLessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const requestDocument = async (
		docName,
		description,
		reqType,
		department
	) => {
		const contract = fetchContract(signer);

		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("requestDocument", [
			docName,
			description,
			reqType,
			department,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGasLessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const fetchAllRequestsForStudent = async () => {
		const contract = fetchContract(signer);
		const data = contract.fetchAllRequestsForStudent();
		return data;
	};

	const fetchIndividualRequest = async (reqId) => {
		const contract = fetchContract(signer);
		const data = contract.fetchIndividualRequest(reqId);
		return data;
	};

	const fetchAllDocumentsForStudent = async () => {
		const contract = fetchContract(signer);
		const data = contract.fetchAllDocumentsForStudent();
		return data;
	};

	const fetchIndividualDocumentForStudent = async (docId) => {
		const contract = fetchContract(signer);
		const data = contract.fetchIndividualDocumentForStudent(docId);
		return data;
	};

	const fetchAllRequestsForCollegeStaff = async () => {
		const contract = fetchContract(signer);
		const data = contract.fetchAllRequestsForCollegeStaff();
		return data;
	};

	const rejectRequest = async (reqId, comment) => {
		const contract = fetchContract(signer);

		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("rejectRequest", [
			reqId,
			comment,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGasLessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const updateRequest = async (reqId, comment) => {
		const contract = fetchContract(signer);

		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("updateRequest", [
			reqId,
			comment,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGasLessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	return (
		<CVPContext.Provider
			value={{
				registerStudent,
				registerStaff,
				requestDocument,
				fetchAllRequestsForStudent,
				fetchIndividualRequest,
				fetchAllDocumentsForStudent,
				fetchIndividualDocumentForStudent,
				fetchAllRequestsForCollegeStaff,
				rejectRequest,
				updateRequest,
			}}
		>
			{children}
		</CVPContext.Provider>
	);
};
