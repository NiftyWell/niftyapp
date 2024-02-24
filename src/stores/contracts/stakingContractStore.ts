import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SmartContract, Address, AbiRegistry, ContractFunction, AddressValue, U64Value, ResultsParser } from "@multiversx/sdk-core";
import abiJson from "@/assets/abi/nifty-staking.json";
import { useVueErd } from 'vue-mvx';

export const useStakingContractStore = defineStore('stakingContract', () => {
  const { account, erd } = useVueErd();
  const contract = ref();
  const contractAddress = "erd1qqqqqqqqqqqqqpgqla4t9cumamez6uuy0t8fmfep0naz0ef4wy7qejnta8"; 
  const registeredPools = ref<any[]>([]);

  const initializeContract = async () => {
    contract.value = new SmartContract({
      address: new Address(contractAddress),
      abi: AbiRegistry.create(abiJson),
    });
    await getPools();
  };

  async function getRegisteredPool(pool_id: any) {
    if (account.logged() && account.address !== undefined) {
      const query = contract.value!.createQuery({
        func: new ContractFunction("getRegisteredPools"),
        args: [new U64Value(pool_id)],
      });
      const response = await erd.providers.proxy.queryContract(query);
      const resultParser = new ResultsParser();
      const result = resultParser.parseQueryResponse(
        response,
        contract.value!.getEndpoint("getRegisteredPools")
      );
      if (result.returnCode.isSuccess()) {
        return result.values[0].valueOf();
      }
    }
  }

  async function getPools() {
    const pool_0 = await getRegisteredPool(0);
    const pool_1 = await getRegisteredPool(1);
    const pool_2 = await getRegisteredPool(2);
    registeredPools.value[0] = {
      id: pool_0.id.c[0],
      start_nonce: pool_0.start_nonce.c[0],
      end_nonce: pool_0.end_nonce.c[0],
      reward: pool_0.reward.c[0] / 10000,
      duration: pool_0.duration_in_seconds.c[0],
    };
    registeredPools.value[1] = {
      id: pool_1.id.c[0],
      start_nonce: pool_1.start_nonce.c[0],
      end_nonce: pool_1.end_nonce.c[0],
      reward: pool_1.reward.c[0] / 10000,
      duration: pool_1.duration_in_seconds.c[0],
    };
    registeredPools.value[2] = {
      id: pool_2.id.c[0],
      start_nonce: pool_2.start_nonce.c[0],
      end_nonce: pool_2.end_nonce.c[0],
      reward: pool_2.reward.c[0] / 10000,
      duration: pool_2.duration_in_seconds.c[0],
    };
  }

  async function getStakedData() {
    if (account.logged() && account.address !== undefined) {
      const address = new AddressValue(account.address);
      const query = contract.value!.createQuery({
        func: new ContractFunction("getUserStakedNFT"),
        args: [address],
      });
      const response = await erd.providers.proxy.queryContract(query);
      const resultParser = new ResultsParser();
      const result = resultParser.parseQueryResponse(
        response,
        contract.value!.getEndpoint("getUserStakedNFT")
      );
      if (result.returnCode.isSuccess()) {
        const nfts = result.values[0].valueOf();
        return nfts;
      }
    }
  }

  return { 
    contract,
    getRegisteredPool,
    getStakedData,
    initializeContract,
  };
});
