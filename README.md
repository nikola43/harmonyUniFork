# Uniswap Interface

[![Unit Tests](https://github.com/Uniswap/uniswap-interface/actions/workflows/unit-tests.yaml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/unit-tests.yaml)
[![Integration Tests](https://github.com/Uniswap/uniswap-interface/actions/workflows/integration-tests.yaml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/integration-tests.yaml)
[![Lint](https://github.com/Uniswap/uniswap-interface/actions/workflows/lint.yml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/lint.yml)
[![Release](https://github.com/Uniswap/uniswap-interface/actions/workflows/release.yaml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/release.yaml)

An open source interface for Uniswap -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [uniswap.org](https://uniswap.org/)
- Interface: [app.uniswap.org](https://app.uniswap.org)
- Docs: [uniswap.org/docs/](https://uniswap.org/docs/)
- Twitter: [@UniswapProtocol](https://twitter.com/UniswapProtocol)
- Reddit: [/r/Uniswap](https://www.reddit.com/r/Uniswap/)
- Email: [contact@uniswap.org](mailto:contact@uniswap.org)
- Discord: [Uniswap](https://discord.gg/FCfyBSbCU5)
- Whitepaper: [Link](https://hackmd.io/C-DvwDSfSxuh-Gd4WKE_ig)

## Accessing the Uniswap Interface

To access the Uniswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest), 
or visit [app.uniswap.org](https://app.uniswap.org).

## Listing a token

Please see the
[@uniswap/default-token-list](https://github.com/uniswap/default-token-list) 
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[Uniswap V2](https://uniswap.org/docs/v2/smart-contracts/factory/) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `main` branch.**
CI checks will run against all PRs.

## Accessing Uniswap Interface V1

The Uniswap Interface supports swapping against, and migrating or removing liquidity from Uniswap V1. However,
if you would like to use Uniswap V1, the Uniswap V1 interface for mainnet and testnets is accessible via IPFS gateways
linked from the [v1.0.0 release](https://github.com/Uniswap/uniswap-interface/releases/tag/v1.0.0).

UniswapV2Factory: 0xa041855C1c2e23f959f6ab9Ac70BEbA0Ec511c5a
hash : 0x269e474423a1d29bef6c0d23e0de37b73fbd4cdc2db36b2fac3267a7d9c585c8
ROUTER: 0x673c9B5D6D6F51E84d937431AfCb98c427991f7d
WEHT : 0x715D0aE552FE5B04A0C3ee7078Ba2fbb804Cc2A3
Multicall: 0xe9B2C9a588684aAb708a20DD255476D6bE063e52

Locker
CountryList 0xAF3F8E71DAB95182D1308922499e30Bb88B61D99
uniswapV2Locker 0xEDED9585bE60FF19F167755912cb1690e2Ff9C7e

old
factory : 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
hash : 0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f
router : 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D

node:  14.21.3