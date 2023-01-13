import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import { activeChainId, CvpABI, CVPAddress } from "./constants";
import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";
import { useAuth } from "./AuthContext";
import { Web3Storage } from "web3.storage";

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

// export const useCVPContext = useContext(CVPContext);

export const useCVPContext = () => useContext(CVPContext);

export const CVPProvider = ({ children }) => {
	const web3AccessToken =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFjNjkxYTc1NTFBODU3MzIzMTE2MWZEMzUyMUFEQ0MyNWFEQzIyOWMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzE3ODk2NzI1MjUsIm5hbWUiOiJIYWNrQU1pbmVycyJ9._DQqNUq6VZ-Zg86ol1YHB0L4sWFtowhD6SSdSIRR23Y";
	const web3Storage = new Web3Storage({ token: web3AccessToken });
	const { currentAccount } = useAuth();

	const connectingWithSmartContract = async () => {
		try {
			const web3Modal = new Wenb3Model();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);
			return contract;
		} catch (error) {
			console.log("Something went wrong while connecting with contract!");
		}
	};

	const registerStudent = async (
		name,
		emailId,
		address,
		mobileNo,
		studentId
	) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		console.log("--------------------------------------------------------");
		console.log(smartAccount);
		console.log("--------------------------------------------------------");

		const data = contract.interface.encodeFunctionData("registerStudent", [
			address,
			name,
			studentId,
			emailId,
			mobileNo,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const registerStaff = async (name, department, emailId, level) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
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

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const requestDocument = async (
		address,
		docName,
		description,
		reqType,
		department
	) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("requestDocument", [
			address,
			docName,
			description,
			reqType,
			department,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const updateRequestDocument = async (
		address,
		docName,
		description,
		reqType,
		department,
		docId
	) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData(
			"updateRequestDocument",
			[address, docName, description, reqType, department, docId]
		);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const fetchAllRequestsForStudent = async () => {
		const contract = await connectingWithSmartContract();
		const data = contract.fetchAllRequestsForStudent();
		return data;
	};

	const fetchIndividualRequest = async (reqId) => {
		const contract = await connectingWithSmartContract();
		const data = contract.fetchIndividualRequest(reqId);
		return data;
	};

	const fetchAllDocumentsForStudent = async () => {
		const contract = await connectingWithSmartContract();
		const data = contract.fetchAllDocumentsForStudent();
		return data;
	};

	const fetchIndividualDocumentForStudent = async (docId) => {
		const contract = await connectingWithSmartContract();
		const data = contract.fetchIndividualDocumentForStudent(docId);
		return data;
	};

	const fetchAllRequestsForCollegeStaff = async () => {
		const contract = await connectingWithSmartContract();
		const data = contract.fetchAllRequestsForCollegeStaff();
		return data;
	};

	const rejectRequest = async (reqId, comment) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
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

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const updateRequest = async (reqId, comment) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
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

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const getAllStudent = async () => {
		const contract = await connectingWithSmartContract();
		const data = await contract.fetchAllStudents();
		console.log(data);
	};

	const getStudent = async () => {
		const contract = await connectingWithSmartContract();
		if (currentAccount) {
			const data = await contract.fetchStudentByAddress(currentAccount);
			console.log(data);
			return data;
		}
	};

	const getAllStaffMembers = async () => {
		const contract = await connectingWithSmartContract();
		const data = await contract.fetchAllStaffMembers();
		console.log(data);
		return data;
	};

	const getStaffMember = async () => {
		const contract = await connectingWithSmartContract();
		if (currentAccount) {
			console.log(currentAccount);
			const data = await contract.fetchCollegeStaffByAddress(
				currentAccount
			);
			console.log(data);
			return data;
		}
	};

	const uploadFilesToIPFS = async (file) => {
		try {
			// console.log(file);
			const cid = await web3Storage.put(file);
			return cid;
		} catch (err) {
			console.log(err);
		}
	};

	const uploadBulkDocuments = async (
		cidArr,
		docName,
		description,
		emails,
		fileNames,
		staffAdd,
		tokens
	) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData(
			"issueMultipleDocument",
			[cidArr, docName, description, emails, fileNames, staffAdd, tokens]
		);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	const issueDocument = async (
		reqId,
		ipfsCID,
		ipfsFileName,
		token,
		staffAdd
	) => {
		const contract = await connectingWithSmartContract();

		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		let smartAccount = new SmartAccount(provider, options);
		smartAccount = await smartAccount.init();

		const data = contract.interface.encodeFunctionData("issueDocument", [
			reqId,
			ipfsCID,
			ipfsFileName,
			token,
			staffAdd,
		]);

		const tx1 = {
			to: CVPAddress,
			data,
		};

		const txResponse = await smartAccount.sendGaslessTransaction({
			transaction: tx1,
		});
		console.log(txResponse);
	};

	// const verifyDocument =

	const verifyDocument = async (token) => {
		const contract = await connectingWithSmartContract();
		const data = await contract.verifyDocument(token, {
			value: ethers.utils.parseUnits("0.001", "ether"),
			gasLimit: 100000,
		});
		return data;
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
				getStudent,
				getAllStudent,
				getStaffMember,
				getAllStaffMembers,
				uploadFilesToIPFS,
				uploadBulkDocuments,
				verifyDocument,
				issueDocument,
				updateRequestDocument,
			}}
		>
			{children}
		</CVPContext.Provider>
	);
};
