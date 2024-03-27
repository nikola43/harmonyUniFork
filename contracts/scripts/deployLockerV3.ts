
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

    
    const countryListContract = await ethers.getContractAt("CountryList", "0xB42747ad2c1DD9B2902Db1630C860A6D3F48dC8e")
    console.log("CountryList", countryListContract.address);

    const AUTO_COLLECT_ACCOUNT = deployer.address
    const FEE_ADDR_LP = deployer.address
    const FEE_ADDR_COLLECT = deployer.address

    const contractFactory = await ethers.getContractFactory("contracts/LockerV3/UNCX_LiquidityLocker_UniV3_Flattend.sol:UNCX_LiquidityLocker_UniV3");
    const uniswapV3Locker = await contractFactory.deploy(
        countryListContract.address, 
        AUTO_COLLECT_ACCOUNT,
        FEE_ADDR_LP,
        FEE_ADDR_COLLECT
    )
    await uniswapV3Locker.deployed();
    console.log("uniswapV3Locker", uniswapV3Locker.address);
    await updateABI("contracts/LockerV3/UNCX_LiquidityLocker_UniV3_Flattend.sol:UNCX_LiquidityLocker_UniV3");

    // await uniswapV3Locker.transferOwnership("0x00eED5EB220c73fD8D8Ca60589e120e53e78f3b8")
    

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


