async function main() {
	const [deployer] = await ethers.getSigners();

	const Implementation = await ethers.getContractFactory("Implementation");
	const implementation = await Implementation.deploy();
	await implementation.deployed();

	const ImplementationV2 = await ethers.getContractFactory("ImplementationV2");
	const implementationV2 = await ImplementationV2.deploy();
	await implementationV2.deployed();

	const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
	const proxy = await TransparentUpgradeableProxy.deploy(implementation.address, deployer.address);
	await proxy.deployed();

	console.log("Implementation deployed to:", implementation.address);
	console.log("ImplementationV2 deployed to:", implementationV2.address);
	console.log("Proxy deployed to:", proxy.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
			console.error(error);
			process.exit(1);
	});