import { useState, useEffect } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { ContractConfig, ArbitrageOpportunity, ArbitrageStats } from "./types";

export function useContract(
  web3: Web3,
  account: string,
  chainId: number
) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contractError, setContractError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [stats, setStats] = useState<ArbitrageStats | null>(null);

  useEffect(() => {
    async function initContract() {
      try {
        setIsLoading(true);
        const config: ContractConfig = getContractConfig(chainId);
        const contractInstance = new web3.eth.Contract(config.abi, config.address);
        setContract(contractInstance);
      } catch (error) {
        setContractError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (web3 && account) {
      initContract();
    }
  }, [web3, account, chainId]);

  async function deployContract(bytecode: string, abi: any[]): Promise<void> {
    if (!web3 || !account) return;
    try {
      setIsLoading(true);
      const newContract = new web3.eth.Contract(abi);
      const deployedContract = await newContract
        .deploy({ data: bytecode })
        .send({ from: account });
      setContract(deployedContract);
    } catch (error) {
      setContractError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkArbitrageProfitability(): Promise<void> {
    if (!contract) return;
    try {
      const result = await contract.methods.getArbitrageOpportunities().call();
      setOpportunities(result);
    } catch (error) {
      setContractError((error as Error).message);
    }
  }

  async function executeArbitrage(opportunity: ArbitrageOpportunity): Promise<void> {
    if (!contract || !account) return;
    try {
      await contract.methods.executeArbitrage(opportunity.tokenA.address, opportunity.tokenB.address).send({ from: account });
    } catch (error) {
      setContractError((error as Error).message);
    }
  }

  async function withdrawProfits(): Promise<void> {
    if (!contract || !account) return;
    try {
      await contract.methods.withdrawProfits().send({ from: account });
    } catch (error) {
      setContractError((error as Error).message);
    }
  }

  return {
    contract,
    isLoading,
    error: contractError,
    opportunities,
    stats,
    deployContract,
    checkArbitrageProfitability,
    executeArbitrage,
    withdrawProfits,
  };
}

function getContractConfig(chainId: number): ContractConfig {
  const configs: Record<number, ContractConfig> = {
    1: { address: "0x...", abi: [], network: "Ethereum" },
    56: { address: "0x...", abi: [], network: "BSC" },
  };
  return configs[chainId] || configs[1];
}