<template>
  <div class="collection-container">
    <h1 class="title">COLLECTION</h1>
    <div class="collection-header">
      <div class="menu-container" @click="toggleFilters">
        <div class="menu-toggle" :class="{'is-open': showFilters}">
          <span class="arrow"></span>
        </div>
      </div>

      <div class="category-selectors">
        <span class="category" :class="{ active: category === 'ALL' }" @click="setCategory('ALL')">ALL</span>
        <span class="category" :class="{ active: category === 'OWNED' }" @click="setCategory('OWNED')" v-if="$erdAccount.address">OWNED</span>
      </div>
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="NUMBER, TRAIT, RANK" @keyup.enter="triggerSearch">
        <img src="@/assets/icons/search.svg" alt="Search" class="search-icon" @click="triggerSearch">
      </div>
    </div>
    <TraitFilter v-if="showFilters" :allTraits="traitOptions" :selectedFilters="selectedFilters" @update:filters="updateFilters" />
    <div class="collection">
      <div v-for="(nft, index) in filteredNfts" :key="index">
        <NftCard :nft="nft" />
      </div>
      <div v-if="showSeeMore && !searchQuery.value" class="see-more" @click="loadMoreNfts">
        <div class="see-more-bubble">
          See more
          <img src="@/assets/icons/arrow.svg" alt="See more" class="see-more-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import NftCard from '@/components/collection/NftCard.vue';
import TraitFilter from '@/components/collection/TraitFilter.vue';
import metadata from '@/assets/metadata/metadata.json';
import traitsData from '@/assets/metadata/traits.json';
import { searchNfts } from '@/utils/search.ts';
import { useUserStore } from '@/stores/userStore';
import { useVueErd } from 'vue-mvx';
const { account, erd, fetchAccount } = useVueErd();
const userStore = useUserStore();
const nfts = ref([...metadata]);
const searchQuery = ref('');
const performSearch = ref(false); 
const showFilters = ref(false);

const selectedFilters = ref({});

const batchSize = ref(10);
const currentBatch = ref(1);
const screenWidth = ref(window.innerWidth);
const category = ref('ALL'); // New ref to track the current category

watch(category, (newCategory) => {
  if (newCategory === 'OWNED') {
    const ownedNfts = [...userStore.walletNfts.rex];

    // Loop through each key in the 'tale' object to gather all NFTs across editions
    for (const edition of Object.keys(userStore.walletNfts.tale)) {
      ownedNfts.push(...userStore.walletNfts.tale[edition]);
    }

    // Assuming a similar structure for 'puzzle' as well
    for (const edition of Object.keys(userStore.walletNfts.puzzle)) {
      ownedNfts.push(...userStore.walletNfts.puzzle[edition]);
    }

    nfts.value = ownedNfts;
  } else {
    nfts.value = [...metadata];
  }
});

watch(account, async () => {
  if (!account.logged()) {
    category.value='ALL';
  }
});


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

onMounted(updateBatchSize);
watch(() => window.innerWidth, (newValue) => {
  screenWidth.value = newValue;
  updateBatchSize();
});
</script>
  
<style lang="scss">
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
