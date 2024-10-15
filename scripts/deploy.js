const { ethers } = require("hardhat");

// V1ABI = [
// 	{
// 		"inputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "getValue",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "newValue",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "setValue",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	}
// ]

async function main() {
  const [deployer] = await ethers.getSigners();

  const Implementation = await ethers.getContractFactory("Implementation");
  const implementation = await Implementation.deploy();
  await implementation.waitForDeployment();

  const ImplementationV2 = await ethers.getContractFactory("ImplementationV2");
  const implementationV2 = await ImplementationV2.deploy();
  await implementationV2.waitForDeployment();

  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const proxy = await TransparentUpgradeableProxy.deploy(implementation.target, deployer.address);
  await proxy.waitForDeployment();

	console.log("-----------------------------------------------------------------------------------------------------------")

  console.log("Implementation deployed to:", implementation.target);
  console.log("ImplementationV2 deployed to:", implementationV2.target);
  console.log("Proxy deployed to:", proxy.target);

	console.log("-----------------------------------------------------------------------------------------------------------")

	console.log("Implementation address in proxy:", await proxy.getImplementation());

	console.log("-----------------------------------------------------------------------------------------------------------")

  const proxyAsImplementation = await ethers.getContractAt("Implementation", proxy.target);

	console.log(proxyAsImplementation)
	// const proxyAsImplementation = new ethers.Contract(proxy.target, V1ABI, deployer);

  let value = await proxyAsImplementation.getValue();

  console.log("Initial value from proxy (Implementation V1):", value.toString());

  await proxyAsImplementation.setValue(42);
  value = await proxyAsImplementation.getValue();
  console.log("Updated value from proxy (Implementation V1):", value.toString());

	console.log("-----------------------------------------------------------------------------------------------------------")

  await proxy.upgradeTo(implementationV2.target); 

	console.log("-----------------------------------------------------------------------------------------------------------")

	console.log("Implementation address in proxy:", await proxy.getImplementation());

	console.log("-----------------------------------------------------------------------------------------------------------")

  const proxyAsImplementationV2 = await ethers.getContractAt("ImplementationV2", proxy.target);

	value = await proxyAsImplementationV2.getValue();
  console.log("Value from proxy after upgrade (Implementation V2):", value.toString());

	await proxyAsImplementationV2.setValue(123);

	value = await proxyAsImplementationV2.getValue();
  console.log("Updated value from proxy (Implementation V2):", value.toString());

  await proxyAsImplementationV2.doubleValue();
  value = await proxyAsImplementationV2.getValue();
  console.log("Value after doubleValue (Implementation V2):", value.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });