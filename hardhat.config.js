require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  //solidity: "0.8.17",
  solidity: {
    version: "0.8.17",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/VU5Z6_VJgdMUgrcfhGsHk2o5tzEfFbhT`,
      accounts: 0x640da600e123cf9bc1aed3b87088db717078323b,
      allowUnlimitedContractSize: true,
    },
  },
};
