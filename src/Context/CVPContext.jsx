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

	return <CVPContext.Provider value={{}}>{children}</CVPContext.Provider>;
};
