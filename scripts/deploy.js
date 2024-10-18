const { ethers } = require("hardhat");

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
	let value = await proxyAsImplementation.getValue();

  console.log("Initial value from proxy (Implementation V1):", value.toString());

  await proxyAsImplementation.setValue(10);
	value = await proxyAsImplementation.getValue();
  console.log("Updated value from proxy (Implementation V1):", value.toString());

  await proxy.upgradeTo(implementationV2.target); 

	console.log("-----------------------------------------------------------------------------------------------------------")
	console.log("Implementation address in proxy:", await proxy.getImplementation());
	console.log("-----------------------------------------------------------------------------------------------------------")

  const proxyAsImplementationV2 = await ethers.getContractAt("ImplementationV2", proxy.target);

	value = await proxyAsImplementationV2.getValue();
  console.log("Value from proxy after upgrade (Implementation V2):", value.toString());

	await proxyAsImplementationV2.setValue(20);

	value = await proxyAsImplementationV2.getValue();
  console.log("Updated value from proxy (Implementation V2):", value.toString());

  await proxyAsImplementationV2.doubleValue();
  value = await proxyAsImplementationV2.getValue();
  console.log("Value after doubleValue (Implementation V2):", value.toString());
	console.log("-----------------------------------------------------------------------------------------------------------")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });