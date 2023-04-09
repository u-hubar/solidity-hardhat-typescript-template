import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-solhint';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';
import 'hardhat-deploy-ethers';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import 'hardhat-tracer';
import 'solidity-coverage';
import { HardhatUserConfig, extendEnvironment } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import './utils/type-extensions';
import { Helpers } from './utils/helpers';
import { accounts, rpc } from './utils/network';

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.helpers = lazyObject(() => new Helpers());
});

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  namedAccounts: {
    deployer: 0,
    minter: 0,
  },
  networks: {
    localhost: {
      url: rpc('localhost'),
      accounts: accounts('localhost'),
      saveDeployments: false,
    },
    hardhat: {
      chainId: 31337,
      gas: 15_000_000,
      gasMultiplier: 1,
      blockGasLimit: 30_000_000,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      loggingEnabled: false,
      allowUnlimitedContractSize: false,
      saveDeployments: false,
      mining: {
        auto: true,
        interval: [3000, 5000],
      },
    },
  },
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          peephole: true,
          inliner: true,
          jumpdestRemover: true,
          orderLiterals: true,
          deduplicate: true,
          cse: true,
          constantOptimizer: true,
          yul: true,
          yulDetails: {
            stackAllocation: true,
          },
        },
      },
      viaIR: process.env.COVERAGE_REPORT ? false : true,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
