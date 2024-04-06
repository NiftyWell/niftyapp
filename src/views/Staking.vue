<template>
  <div class="collection-container">
    <h1 class="title">STAKING</h1>
    <div class="collection-header">
      <div class="menu-container" @click="toggleFilters">
        <div class="menu-toggle" :class="{'is-open': showFilters}">
          <span class="arrow"></span>
        </div>
      </div>

      <div class="category-selectors">
        <span class="category" :class="{ active: category === 'STAKED' }" @click="setCategory('STAKED')"  v-if="$erdAccount.address">STAKED</span>
        <span class="category" :class="{ active: category === 'ADD' }" @click="setCategory('ADD')"  v-if="$erdAccount.address">ADD</span>
        <span class="category" :class="{ active: category === 'UNBONDING' }" @click="setCategory('UNBONDING')" v-if="$erdAccount.address">UNBONDING</span>
      </div>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="NUMBER, TRAIT, RANK" @keyup.enter="triggerSearch">
        <img src="@/assets/icons/search.svg" alt="Search" class="search-icon" @click="triggerSearch">
      </div>
    </div>
    <TraitFilter v-if="showFilters" :allTraits="traitOptions" :selectedFilters="selectedFilters" @update:filters="updateFilters" />
    <div v-if="$erdAccount.address" class="collection">
      <div class="interactions-container">
        <div class="info" v-if="category === 'STAKED' && nfts.length <= 0">
          You need to stake nfts first.
        </div>
        <div class="info" v-if="category === 'UNBONDING' && nfts.length <= 0">
          You need to stake and unstake nfts first.
        </div>
        <button v-if="userStore.getSize(userStore.stakedNfts)>0 && category === 'STAKED' && userStore.getSize(selectedNfts) > 0" @click="show = true" class="button-white interactions">UNSTAKE {{ userStore.getSize(selectedNfts) ? userStore.getSize(selectedNfts) : ''}}</button>
        <button v-if="userStore.getSize(userStore.walletBalance)>0 && category === 'ADD' && userStore.getSize(selectedNfts) > 0" @click="show = true" class="button-white interactions">STAKE {{ userStore.getSize(selectedNfts) ? userStore.getSize(selectedNfts) : ''}}</button>
        <button v-if="userStore.getSize(userStore.stakedNfts)>0 && category === 'UNBONDING'" @click="show = true" class="button-white interactions">CLAIM</button>
      </div>
      <div v-for="(nft, index) in filteredNfts" :key="index">
        <NftCard v-if="category === 'STAKED' || category === 'ADD'" :nft="nft" :select="true" @selectionChanged="handleSelectionChanged"/>
        <NftCard v-else :nft="nft" @selectionChanged="handleSelectionChanged"/>
      </div>
      <div v-if="showSeeMore && !searchQuery.value" class="see-more" @click="loadMoreNfts">
        <div class="see-more-bubble">
          See more
          <img src="@/assets/icons/arrow.svg" alt="See more" class="see-more-icon" />
        </div>
      </div>
    </div>
    <div class="collection" v-else>
      You need to connect to see your staked NFTs
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, onMounted, watch } from 'vue';
import NftCard from '@/components/collection/NftCard.vue';
import TraitFilter from '@/components/collection/TraitFilter.vue';
import metadata from '@/assets/metadata/metadata.json';
import traitsData from '@/assets/metadata/traits.json';
import { searchNfts } from '@/utils/search.ts';
import { useUserStore } from '@/stores/userStore';
import { useVueErd } from 'vue-mvx';
import { sleep } from '@/utils/utils';
import { useStakingContractStore } from '@/stores/contracts/stakingContractStore';

const { account, erd, fetchAccount } = useVueErd();
const userStore = useUserStore();
const stakeStore = useStakingContractStore();
const nfts = ref([]);
const searchQuery = ref('');
const performSearch = ref(false); 
const showFilters = ref(false);

const selectedFilters = ref({});

const batchSize = ref(10);
const currentBatch = ref(1);
const screenWidth = ref(window.innerWidth);
const category = ref(''); // New ref to track the current category
const stakedNfts = ref([]);
const unstakedNfts = ref([]);
const selectedNfts = ref({
  rex: [],
  tale: {},
});
const resetTrigger = ref(false);
provide('resetTrigger', resetTrigger);
const toggleResetTrigger = () => {
  resetTrigger.value = !resetTrigger.value;
};
watch(category, () => {
  toggleResetTrigger();
});

const stake = async () => {
  console.log("account is:", account);
  const tx = await stakeStore.makeTransaction('test', account.address, 10_000_000);
  //stakeStore.claimRewards();
  userStore.sendTransaction(tx);
}

const clearSelection = () => {
  selectedNfts.value = {
    rex: [],
    tale: {},
  };
}

watch(category, (newCategory) => {
  if (newCategory === 'UNBONDING') {
    nfts.value = [];
    clearSelection();
    nfts.value.push(...userStore.unstakedNfts.rex);

    for (const edition of Object.keys(userStore.unstakedNfts.tale)) {
      nfts.value.push(...userStore.unstakedNfts.tale[edition]);
    }
  } else if (newCategory === 'STAKED') {
    nfts.value = [];
    clearSelection();
    nfts.value.push(...userStore.stakedNfts.rex);

    for (const edition of Object.keys(userStore.stakedNfts.tale)) {
      nfts.value.push(...userStore.stakedNfts.tale[edition]);
    }
  } else {
    nfts.value = [];
    clearSelection();
    nfts.value.push(...userStore.walletBalance.rex);
    for (const edition of Object.keys(userStore.walletBalance.tale)) {
      nfts.value.push(...userStore.walletBalance.tale[edition]);
    }
  }
});

watch(account, async () => {
  if (!account.logged()) {
    console.log("Account not logged in");
    category.value='';
  }
  else {
    category.value='';
    await sleep(500);
    category.value='STAKED';
  }
});

const handleSelectionChanged = ({ nft, isSelected }) => {
  // Function to add an NFT to the correct category and tale number
  const addNft = (nft) => {
    const rexMatch = nft.name.match(/^Nifty Rex #(\d+)/);
    const taleMatch = nft.name.match(/^Nifty Tale #(\d+)/);

    if (rexMatch) {
      selectedNfts.value.rex.push(nft);
    } else if (taleMatch) {
      const taleNumber = parseInt(taleMatch[1]);
      if (!selectedNfts.value.tale[taleNumber]) {
        selectedNfts.value.tale[taleNumber] = [];
      }
      selectedNfts.value.tale[taleNumber].push(nft);
    }
  };

  // Function to remove an NFT from the correct category and tale number
  const removeNft = (nft) => {
    const rexMatch = nft.name.match(/^Nifty Rex #(\d+)/);
    const taleMatch = nft.name.match(/^Nifty Tale #(\d+)/);

    if (rexMatch) {
      selectedNfts.value.rex = selectedNfts.value.rex.filter(selectedNfts => selectedNfts.name !== nft.name);
    } else if (taleMatch) {
      const taleNumber = parseInt(taleMatch[1]);
      if (selectedNfts.value.tale[taleNumber]) {
        selectedNfts.value.tale[taleNumber] = selectedNfts.value.tale[taleNumber].filter(selectedNfts => selectedNfts.name !== nft.name);
      }
    }
  };

  // Add or remove the NFT based on its selection state
  if (isSelected) {
    addNft(nft);
  } else {
    removeNft(nft);
  }

  console.log("Updated selected NFTs:", selectedNfts.value);
};


const traitOptions = traitsData.reduce((acc, { type, traits }) => {
  acc[type] = traits.map(trait => trait.name);
  return acc;
}, {});

const setCategory = (newCategory) => {
  category.value = newCategory;
  performSearch.value = false; // Reset search state when changing categories
  currentBatch.value = 1; // Reset batch size when changing categories
};

const updateBatchSize = () => {
  const cardWidth = 217;
  const cardsPerRow = Math.floor(screenWidth.value * 0.7 / cardWidth);
  batchSize.value = cardsPerRow * 2;
};

const triggerSearch = () => {
  if (searchQuery.value.trim()) {
    performSearch.value = !performSearch.value;
  } else {
    currentBatch.value = 1;
  }
};

const updateFilters = (filters) => {
  selectedFilters.value = filters;
  performSearch.value = !performSearch.value;
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const filteredNfts = computed(() => {
  let filtered = nfts.value;

  if (searchQuery.value.trim()) {
    filtered = searchNfts(filtered, searchQuery.value.trim());
  }

  Object.entries(selectedFilters.value).forEach(([type, values]) => {
    if (values && values.length > 0) {
      filtered = filtered.filter(nft => 
        nft.attributes.some(attr => attr.trait_type === type && values.includes(attr.value))
      );
    }
  });

  return filtered.slice(0, currentBatch.value * batchSize.value);
});

const showSeeMore = computed(() => nfts.value.length > filteredNfts.value.length);

const loadMoreNfts = () => {
  if (!searchQuery.value.trim()) {
    currentBatch.value += 1;
  }
};

onMounted(() => {
  updateBatchSize();
  category.value = 'STAKED';
});
watch(() => window.innerWidth, (newValue) => {
  screenWidth.value = newValue;
  updateBatchSize();
});
/*
async function stake(tokens) {
    
    if (account.logged() && account.address !== undefined) {
      let gasLimit = Math.ceil(3399269 + 3640683 * tokens.length * 1.4);
      if (gasLimit <= 60_000_000) {
        gasLimit += 60_000_000;
      }
      console.log(tokens);
      console.log(gasLimit);

      const networkConfig = await erd.proxy.getNetworkConfig();
      console.log("PROVIDERS");
      console.log(networkConfig);
      console.log(erd.proxy.config.timeout);

      const piecesData = formatMultiEsdtData(tokens, tokens[0].ticker);
      const SCFunctionHex = strToHex("multiStakeNFTS");
      let pool_id = "";
      if (tokens[0].ticker.includes("REX")) {
        pool_id = "00";
      } else {
        pool_id = "0" + String(tokens[0].tale);
      }
      const dataFormat = `MultiESDTNFTTransfer@${SCAddressHex}@${piecesData}@${SCFunctionHex}@${pool_id}`;
      const payload = new TransactionPayload(dataFormat);

      stakeStore.makeTransaction(dataFormat, stakeStore.contractAddress, gasLimit);

      console.log(sender_account.value!.address);
      console.log("tx:");
      console.log(tx);
      console.log(tx.getData().toString());
      tx.setNonce(sender_account.value!.getNonceThenIncrement());
      await erd.providers
        .signAndSend(tx)
        .then((result: Transaction) => {
          transactionUrl.value = erd.explorerTransactionUrl(result);
          initTxToaster();
          console.log(transactionUrl.value);
          const res = erd.providers.transactionResult(result);
          alreadyClicked = true;
          //return res;
        })
        .catch(async (error: Error) => {
          console.error(error);
          console.log(error);
          if (error.message.includes("No matching key")) {
            toast_info.value = {
              title: "Wallet connection lost.",
              message: "Please reconnect.",
              status: null,
              link: null,
            };
            toast_id.value = toast(Msg, {
              autoClose: 5000,
              closeOnClick: true,
              closeButton: true,
              type: "warning",
              isLoading: false,
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            await sleep(5000);
            erd.logout();
          }
        });
      return alreadyClicked;
    }
    
}*/
</script>
  
<style lang="scss">
.interactions-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.3rem;
    position: relative;
    margin: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.interactions {
  align-items: center;
  margin-bottom: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  height: 5.5rem !important;
  border-radius: 5.5rem !important;
  width: 5.5rem !important;
}
.info {
  padding-bottom: 2rem;
}
.collection-container {
  .title {
    text-align: center;
    font-weight: normal;
    margin-bottom: 1rem; // Added margin for spacing
  }

  .collection-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    justify-content: flex-start; // Align items to the left
    margin-left: 1.7rem;
    .menu-container {
      width: 1.9rem;
      height: 1.5rem;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.07);
      border-radius: 0.5rem;
      align-items: center;
      justify-content: center;
      display: flex;
    }

    .menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px; 
      height: 30px; 
      cursor: pointer;
      .arrow {
        border: solid black;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(-45deg);
        transition: transform 0.3s ease-in-out;
      }

      &.is-open .arrow {
        transform: rotate(45deg);
      }
    }

    .category-selectors {
      font-size: larger;
      display: flex;
      align-items: center;
      color: #727272;
      margin-right: 1rem;
      margin-left: 1rem;
      .category {
        margin-right: 1rem;
        cursor: pointer;

        &.active {
          border-bottom: 3px solid black;
          border-radius: 2px;
          margin-top: 5px;
          color: black;
        }
      }
    }

    .search-bar {
      flex-grow: 1;
      position: relative;

      input {
        font-family: "NiftyFont", sans-serif !important;
        font-size: larger;
        width: 95%; 
        border: none;
        padding: 0.5rem;
        border-radius: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        &:focus {
          outline: none; 
          border: none; 
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
        }
      }

      .search-icon {
        position: absolute;
        right: 5%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .collection {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding-bottom: 2rem; 
  }

  .see-more {
    width: 100%;
    display: flex;
    justify-content: center; 

    &-icon {
      width: 1rem;
      height: auto;
      margin-left: 1rem;
      transform: rotate(90deg); 
    }
    
    &-bubble {
      text-align: center;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
      padding: 0.5rem 1rem; 
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15); 
      border-radius: 100px; 
      background-color: #fff; 
    }
  }
}
@media (max-width: 768px) {
  .collection-container {
    .collection-header {
      flex-direction: column; 

      .menu-container {
        margin-bottom: 1rem; 
      }

      .category-selectors {
        margin-left: 0; 
      }

      .search-bar {
        margin-top: 1rem; 
      }
    }
  }
}
</style>
