import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useVueErd } from 'vue-mvx';
import { useMainStore } from '@/stores/mainStore';
import { useStakingContractStore } from './contracts/stakingContractStore';
import metadata from '@/assets/metadata/metadata.json';
import other_metadata from '@/assets/metadata/other/metadata.json';
import { NftMetadata } from '@/types';
import { decodeBase64, parseAttributes } from '@/utils/utils';
import { Transaction, ResultsParser } from "@multiversx/sdk-core";
import type { ITransactionOnNetwork } from "@multiversx/sdk-core";
import { sleep } from '@/utils/utils';
// Toasts
import "vue3-toastify/dist/index.css";
import type { Id } from "vue3-toastify";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Msg from "@/components/toasts/Msg.vue";

export const useUserStore = defineStore('user', () => {
  const { account, erd, fetchAccount } = useVueErd();
  const mainStore = useMainStore();
  const stakingStore = useStakingContractStore();
  const nfts = ref<NftMetadata[]>(metadata as NftMetadata[]);
  const other_nfts = ref<Record<string, NftMetadata>>(other_metadata as Record<string, NftMetadata>);
  const ticker = mainStore.ticker;
  const walletBalance = ref<{
    rex: NftMetadata[];
    tale: { [key: number]: NftMetadata[] };
    puzzle: { [key: number]: NftMetadata[] };
    token: String;
  }>({
    rex: [],
    tale: {},
    puzzle: {},
    token: "0",
  });

  const stakedNfts = ref<{
    rex: NftMetadata[];
    tale: { [key: number]: NftMetadata[] };
  }>({
    rex: [],
    tale: {},
  });

  const unstakedNfts = ref<{
    rex: NftMetadata[];
    tale: { [key: number]: NftMetadata[] };
  }>({
    rex: [],
    tale: {},
  });

  // Toasters section

  const active_toast = ref();
  const toast_info = ref();
  const toast_id = ref<Id>();
  const transactionUrl = ref();
  const transactionState = ref();
  const transactionResult = ref();

  const getSize = (NftsObject: any) => {
    let totalCount = NftsObject.rex.length; // Count of items in rex array

    // Count of items in each array within the tale object
    for (const edition in NftsObject.tale) {
        totalCount += NftsObject.tale[edition].length;
    }

    return totalCount;
}

  const getTotalLength = (nftRef: { rex: NftMetadata[]; tale: { [key: number]: NftMetadata[] } }) => {
    let totalLength = 0;
    totalLength += nftRef.rex.length;
    for (const key in nftRef.tale) {
      if (Object.prototype.hasOwnProperty.call(nftRef.tale, key)) {
        totalLength += nftRef.tale[key].length;
      }
    }
    return totalLength;
  };
  
  const clearWallet = () => {
    walletBalance.value = {
        rex: [],
        tale: {},
        puzzle: {},
        token: "0",
      };
    clearStaked();
    clearUnstaked();
  }

  const clearStaked = () => {
    stakedNfts.value = {
      rex: [],
      tale: {},
    };
  }

  const clearUnstaked = () => {
    unstakedNfts.value = {
      rex: [],
      tale: {},
    };
  }

  const initUser = async () => {
    if (account.logged() && account.address) {
      await clearWallet();
      await stakingStore.initializeContract();
      await loadWalletBalance();
      await loadStakedNfts();
      await loadUnstakedNfts();
    }
  }

  
  const getEsdtBalance = () => {
    axios
        .get(
          `${erd.providers.api.url}/accounts/${account.address}/tokens/${ticker.token}`
        )
        .then((res) => {
          walletBalance.value.token = (
            res.data.balance *
            10 ** -parseInt(res.data.decimals)
          ).toFixed(2);
        })
        .catch((err) => {
          console.log(err);
          walletBalance.value.token = "0";
        });
  }

  const getNftBalance = () => {
    const collectionsUrl = `${erd.providers.api.url}/accounts/${account.address}/nfts?size=10000&collections=${ticker.rex},${ticker.tales},${ticker.puzzle}`;
    axios.get(collectionsUrl)
      .then((response) => {
        const fetchedNFTs = response.data;
        fetchedNFTs.forEach((nft: any) => {
          if (nft.collection === ticker.rex) {
            const matchingMetadata = nfts.value.find((meta) => meta.edition === nft.nonce);
            if (matchingMetadata) {
              matchingMetadata.type = "NonFungibleESDT";
              walletBalance.value.rex.push(matchingMetadata);
            }
          } else if (nft.collection === ticker.tales || nft.collection === ticker.puzzle) {
            const decodedAttributes = decodeBase64(nft.attributes);
            const attributes = parseAttributes(decodedAttributes);
            const tags = attributes.find((attr) => attr.trait_type.toLowerCase() === 'tags')?.value || '';
            
            let newNftMetadata;
            
            if (Object.keys(nft.metadata).length === 0) {
              newNftMetadata = {
                description: nft.name,
                name: nft.name,
                edition: nft.nonce,
                dna: '',
                image: nft.url,
                attributes: attributes.filter((attr) => attr.trait_type.toLowerCase() !== 'tags'),
                tags: tags,
                rank: nft.nonce,
                minted: 'true',
                market: 'false',
                balance: nft.type === 'NonFungibleESDT' ? 1 : nft.balance,
                type: nft.type,
              };
            } else {
              newNftMetadata = nft.metadata;
              newNftMetadata.type = nft.type;
              newNftMetadata.balance = nft.type === 'NonFungibleESDT' ? 1 : nft.balance;
              newNftMetadata.rank = nft.rank;
            }
            
            const editionMatch = nft.name.match(/#(\d+)/);
            const edition = editionMatch ? parseInt(editionMatch[1], 10) : 1;
        
            const collectionType = nft.collection === ticker.tales ? 'tale' : 'puzzle';
        
            if (!walletBalance.value[collectionType][edition]) {
              walletBalance.value[collectionType][edition] = [];
            }
            newNftMetadata.name = newNftMetadata.name.replace("Golden Ticket", "Gold");
            walletBalance.value[collectionType][edition].push(newNftMetadata);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching NFTs: ", error);
      });
  }
  
  
  const loadWalletBalance = async () => {
    if (account.logged() && account.address) {
      await fetchAccount(); // Ensure the account is fetched before making the call
      try {
        clearWallet();
        await getNftBalance();
        await getEsdtBalance();
      } catch (err) {
        console.error('Error loading wallet NFTs:', err);
      }
    }
  };
  


  const loadStakedNfts = async () => {
    clearStaked();
    const stakedData = await stakingStore.getStakedData(); // Fetch staked NFTs data
    for (const nft of stakedData) {
      const poolId = parseInt(nft.pool_id, 10);
      if (poolId > 0) {
        const taleKey = `NiftyTale#${poolId}`;
        const taleMetadata = (other_nfts.value as Record<string, NftMetadata>)[taleKey];
        if (taleMetadata) { 
          let matchingMetadata: NftMetadata | null = null; 
          matchingMetadata = { ...taleMetadata };
          matchingMetadata.edition = nft.nonce;
          matchingMetadata.rank = nft.nonce;
          matchingMetadata.status = "staked";
          if (!stakedNfts.value['tale'][poolId]) {
            stakedNfts.value['tale'][poolId] = [];
          }
          stakedNfts.value['tale'][poolId].push(matchingMetadata);
        }
      }
      else {
        const editionNumber = parseInt(nft.nonce, 10);
        const foundMetadata = nfts.value.find((meta) => meta.edition === editionNumber);
      
        if (foundMetadata) { 
          let alreadyExists = stakedNfts.value.rex.some((meta) => meta.edition === editionNumber);
          
          if (!alreadyExists) {
            let matchingMetadata = { ...foundMetadata, status: "staked" }; 
            stakedNfts.value.rex.push(matchingMetadata);
          }
        } 
      }      
    }
  };

  const loadUnstakedNfts = async () => {
    clearUnstaked();
    await stakingStore.getPools();
    const unstakedData = await stakingStore.getUnstakedData(); // Fetch staked NFTs data
    for (const nft of unstakedData) {
      const poolId = parseInt(nft.old_pool_id, 10);
      if (poolId > 0) {
        const taleKey = `NiftyTale#${poolId}`;
        const taleMetadata = (other_nfts.value as Record<string, NftMetadata>)[taleKey];
        if (taleMetadata) { 
          let matchingMetadata: NftMetadata | null = null; 
          matchingMetadata = { ...taleMetadata };
          matchingMetadata.edition = nft.nonce;
          matchingMetadata.rank = nft.nonce;
          matchingMetadata.status = "unstaked";
          matchingMetadata.timestamp = nft.unstake_timestamp.c[0];
          matchingMetadata.duration =  stakingStore.registeredPools[poolId].duration;
          if (!unstakedNfts.value['tale'][poolId]) {
            unstakedNfts.value['tale'][poolId] = [];
          }
          unstakedNfts.value['tale'][poolId].push(matchingMetadata);
        }
      }
      else {
        const editionNumber = parseInt(nft.nonce, 10);
        const foundMetadata = nfts.value.find((meta) => meta.edition === editionNumber);
        if (foundMetadata) { 
          let alreadyExists = unstakedNfts.value.rex.some((meta) => meta.edition === editionNumber);
          
          if (!alreadyExists) {
            let matchingMetadata = { ...foundMetadata, status: "unstaked" }; 
            matchingMetadata.timestamp = nft.unstake_timestamp.c[0];
            matchingMetadata.duration =  stakingStore.registeredPools[nft.old_pool_id.c[0]].duration;
            unstakedNfts.value.rex.push(matchingMetadata);
          }
        } 
      }      
    }
  };


  const reset = async () => {
    transactionState.value = undefined;
    transactionResult.value = undefined;
    transactionUrl.value = undefined;

    clearWallet();
    await initUser();
  }
  
  onMounted(async () => {
    erd.on("transaction", async (transaction: ITransactionOnNetwork) => {
      transactionUrl.value =
        "https://explorer.multiversx.com/transactions/" + transaction.hash;
      let returnCode = null;
      try {
        returnCode = await new ResultsParser().parseUntypedOutcome(transaction);
      } catch (e) {
        console.log(e);
      }
      if (returnCode != null && returnCode.returnCode.isSuccess()) {
        console.log("TX SUCCESS");
        toast_info.value = { 
          title: "Transaction success!", 
          message: "Your transaction was processed.",
          status: true,
          link: transactionUrl.value,
        };
        toast.update(toast_id.value!, {
          autoClose: 20000,
          type: "success",
          isLoading: false,
          onClose: () => {
            active_toast.value = undefined;
            toast_info.value = undefined;
            toast_id.value = undefined;
          }
        });
        reset();
        return;
      } else if (returnCode != null) {
        toast_info.value = {
          title: "Transaction failed!",
          message: returnCode.returnMessage,
          status: returnCode.returnCode.isSuccess(),
          link: transactionUrl.value,
        };
        toast.update(toast_id.value!, {
          autoClose: 20000,
          type: "error",
          isLoading: false,
        });
        return;
      } else {
        toast_info.value = {
          title: "Something Happend!",
          message: "Check your transaction.",
          status: false,
          link: transactionUrl.value,
        };
        toast.update(toast_id.value!, {
          autoClose: 20000,
          type: "info",
          isLoading: false,
        });
      }
      console.log("TX NOT SUCCESS");
      sleep(3000);
      reset();
    });
  });

  function initTxToaster() {
    toast_info.value = {
      title: "Transaction pending!",
      message: "Processing your transaction.",
      status: false,
      link: transactionUrl.value,
    };
    toast_id.value = toast(Msg, {
      autoClose: true,
      closeOnClick: false,
      closeButton: true,
      type: "loading",
      isLoading: true,
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }

  const sendTransaction = async (tx: Transaction) => {
    console.log("Preped transaction:", tx);
  
    await erd.providers
        .signAndSend(tx)
        .then((result: Transaction) => {
          transactionUrl.value = erd.explorerTransactionUrl(result);
          initTxToaster();
          console.log(transactionUrl.value);
          const res = erd.providers.transactionResult(result);
          return res;
        })
        .catch((error: Error) => {
          console.error(error);
          transactionResult.value = error;
        });
      return { sessionId: null, error: "tx invalid" };
  }

  return { walletBalance, stakedNfts, unstakedNfts, toast_info, initUser, getTotalLength, loadWalletBalance, loadStakedNfts, loadUnstakedNfts, getSize, clearWallet, sendTransaction };
});
