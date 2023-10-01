import { ethers } from "hardhat";
import { chains, supportedNetworks } from "./common";
import fs from "fs";

async function main() {
  // check if the network is supported
  const network = await ethers.provider.getNetwork();
  const networkName = supportedNetworks[network.chainId];
  if (networkName == undefined) throw "Unsupported Chain";

  // check if contract already deployed to the selected network
  const filePath = `./deployments/${networkName}.json`;

  if (!fs.existsSync(filePath))
    throw "Cannot find deployed contracts on the selected chain";

  const { address } = JSON.parse(fs.readFileSync(filePath).toString("utf-8"));

  const Governor = await ethers.getContractFactory("MockGovernor");
  const governor = Governor.attach(address);

  console.log(
    await governor.crossChainProposals(chains["polygon-mumbai"].selector, 1)
  );

  await governor.voteOnCrossChainProposal(
    chains["polygon-mumbai"].selector,
    1,
    1,
    2
  );

  console.log(
    await governor.crossChainProposals(chains["polygon-mumbai"].selector, 1)
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
