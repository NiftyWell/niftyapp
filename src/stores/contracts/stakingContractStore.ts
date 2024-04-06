import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SmartContract, Address, AbiRegistry, ContractFunction, AddressValue, U64Value, ResultsParser, TransactionPayload, Transaction, TokenTransfer } from "@multiversx/sdk-core";
import abiJson from "@/assets/abi/nifty-staking.json";
import { useVueErd } from 'vue-mvx';

export const useStakingContractStore = defineStore('stakingContract', () => {
  const { account, erd, fetchAccount } = useVueErd();
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


  const unbondingTimeLeft = (timestamp: any, pool_duration: any) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedTime = currentTime - timestamp;
    const remainingTime = pool_duration - elapsedTime;
    return remainingTime;
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

  async function getUnstakedData() {
    if (account.logged() && account.address !== undefined) {
      const address = new AddressValue(account.address);
      const query = contract.value!.createQuery({
        func: new ContractFunction("getUserUnstakedNFT"),
        args: [address],
      });
      const response = await erd.providers.proxy.queryContract(query);
      const resultParser = new ResultsParser();
      const result = resultParser.parseQueryResponse(
        response,
        contract.value!.getEndpoint("getUserUnstakedNFT")
      );
      if (result.returnCode.isSuccess()) {
        const nfts = result.values[0].valueOf();
        return nfts;
      }
    }
  }

  async function makeTransaction(data: any, receiver: any, gas: any) {
    if (account.logged() && account.address !== undefined) {
      const sender_account = await fetchAccount();
      const networkConfig = await erd.proxy.getNetworkConfig();
      const payload = new TransactionPayload(data);

      const tx = new Transaction({
        value: TokenTransfer.egldFromAmount(0),
        sender: sender_account.address,
        receiver: receiver,
        gasLimit: gas,
        data: payload,
        chainID: networkConfig.ChainID,
      });
      tx.setNonce(sender_account.getNonceThenIncrement());
      return tx;
      /*await erd.providers
        .signAndSend(tx)
        .then((result: Transaction) => {
          //transactionUrl.value = erd.explorerTransactionUrl(result);
          //initTxToaster();
          //console.log(transactionUrl.value);
          const res = erd.providers.transactionResult(result);
          return res;
        })
        .catch((error: Error) => {
          console.error(error);
          //transactionResult.value = error;
        });
      return { sessionId: null, error: "tx invalid" };*/
    }
  }

  async function claimRewards() {
    if (account.logged() && account.address !== undefined) {
      const sender_account = await fetchAccount();
      const networkConfig = await erd.proxy.getNetworkConfig();
      let gasLimit = 10_000_000;
      const dataFormat = `claimRewards`;
      const payload = new TransactionPayload(dataFormat);

      const tx = new Transaction({
        data: payload,
        gasLimit: gasLimit,
        receiver: sender_account.address,
        value: TokenTransfer.egldFromAmount(0),
        chainID: networkConfig.ChainID,
        sender: sender_account.address,
      });

      console.log(sender_account.address);
      console.log("tx:");
      console.log(tx);
      console.log(tx.getData().toString());
      tx.setNonce(sender_account.getNonceThenIncrement());
      /*const signed_tx = await erd.providers.currentProvider.signTransaction(tx);
          console.log(signed_tx);*/
      await erd.providers
        .signAndSend(tx)
        .then((result: Transaction) => {
          const transactionUrl = erd.explorerTransactionUrl(result);
          console.log(transactionUrl);
          const res = erd.providers.transactionResult(result);
          return res;
        })
        .catch((error: Error) => {
          console.error(error);
        });
      return { sessionId: null, error: "tx invalid" };
    }
  }

  return { 
    contract,
    registeredPools,
    getRegisteredPool,
    getPools,
    getStakedData,
    getUnstakedData,
    initializeContract,
    unbondingTimeLeft,
    makeTransaction,
    claimRewards,
  };
});
