
import { ethers } from 'hardhat'
import { formatEther, parseEther } from 'ethers/lib/utils';
const colors = require('colors/safe');
import { updateABI, verify } from './util';

async function main() {
    const [deployer] = await ethers.getSigners();
    if (deployer === undefined) throw new Error("Deployer is undefined.");
    console.log(
        colors.cyan("Deployer Address: ") + colors.yellow(deployer.address)
    );
    console.log(
        colors.cyan("Account balance: ") +
        colors.yellow(formatEther(await deployer.getBalance()))
    );
    console.log();

    
    /*
    const router = "0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB";
    const rContract = await ethers.getContractAt("UniswapV2Router", router);
    const factory = await rContract.factory();
    console.log({
        factory
    })
    */
    

    
    let contractName = "CountryList";
    let contractFactory = await ethers.getContractFactory(contractName);
    const countryListContract = await contractFactory.deploy()
    await countryListContract.deployed();
    console.log("CountryList", countryListContract.address);
    await updateABI(contractName);


    const factory = "0xA780FcBFF7c5232FDbEF4fc67313bEcFfdf64172";
    contractName = "UniswapV2Locker";
    contractFactory = await ethers.getContractFactory(contractName);
    const uniswapV2Locker = await contractFactory.deploy(factory, countryListContract.address)
    await uniswapV2Locker.deployed();
    console.log("uniswapV2Locker", uniswapV2Locker.address);
    await updateABI(contractName);

    await uniswapV2Locker.transferOwnership("0x00eED5EB220c73fD8D8Ca60589e120e53e78f3b8")
    

}

main()
    .then(async (r: any) => {
        console.log("");
        return r;
    })
    .catch(error => {
        console.log(colors.red("ERROR :("));
        console.log(colors.red(error));
        return undefined;
    })


