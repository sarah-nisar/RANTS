import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";

import { CvpABI, CVPAddress } from "./constants";

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(CVPAddress, CvpABI, signerOrProvider);

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

export const CVPContext = React.createContext();

export const CVPProvider = ({ children }) => {
	return <CVPContext.Provider value={{}}>{children}</CVPContext.Provider>;
};
