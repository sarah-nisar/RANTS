const hre = require("hardhat");

async function main() {
	const Cvp = await hre.ethers.getContractFactory("Storage");
	const cvp = await Cvp.deploy();

	await cvp.deployed();

	console.log(`Cvp deployed to ${cvp.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
