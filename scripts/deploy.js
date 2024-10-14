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

	console.log("Implementation deployed to:", implementation.target);
	console.log("ImplementationV2 deployed to:", implementationV2.target);
	console.log("Proxy deployed to:", proxy.target);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
			console.error(error);
			process.exit(1);
	});