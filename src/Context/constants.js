import cvp from "../artifacts/contracts/Cvp.sol/Cvp.json";

export const CVPAddress = "0x9d28fD58bB8625dd5Bfb20EDeD37076Cdcc784F5";
export const CvpABI = cvp.abi;

export const ChainId = {
	MAINNET: 1,
	GOERLI: 5,
	POLYGON_MUMBAI: 80001,
	POLYGON_MAINNET: 137,
};

export let activeChainId = ChainId.POLYGON_MUMBAI;
export const supportedChains = [
	ChainId.GOERLI,
	ChainId.POLYGON_MAINNET,
	ChainId.POLYGON_MUMBAI,
];
