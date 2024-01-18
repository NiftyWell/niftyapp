<template>
    <div class="collection-container">
        <h1 class="title">COLLECTION</h1>
      <div class="collection-header">
        <div class="menu-container">
            <div class="menu-toggle">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
        
        <div class="category-selectors">
          <span class="category active">ALL</span>
          <span class="category">OWNED</span>
        </div>
        <div class="search-bar">
          <input type="text" placeholder="NUMBER, TRAIT, RANK">
          <img src="@/assets/icons/search.svg" alt="Search" class="search-icon" />
        </div>
      </div>
      <div class="collection">
        <div v-for="(nft, index) in nftsToShow" :key="index">
            <NftCard :nft="nft" />
        </div>
        <div v-if="showSeeMore" class="see-more" @click="loadMoreNfts">
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
import NftCard from '@/components/collection/Nftcard.vue';
import metadata from '@/assets/metadata/metadata.json';

const nfts = metadata;
const batchSize = ref(10);
const currentBatch = ref(1);
const screenWidth = ref(window.innerWidth);

const updateBatchSize = () => {
    const cardWidth = 217;
    const cardsPerRow = Math.floor(screenWidth.value*0.7 / cardWidth);
    batchSize.value = cardsPerRow * 2; 
};

const nftsToShow = computed(() => {
    return nfts.slice(0, currentBatch.value * batchSize.value);
});

const showSeeMore = computed(() => {
    return nfts.length > nftsToShow.value.length;
});

const loadMoreNfts = () => {
    currentBatch.value += 1;
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
      width: 1rem;
      height: 0.7rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;

      .line {
        height: 3px;
        background-color: black;
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
      flex-grow: 1; // Make the search bar take up all available space
      position: relative;

      input {
        font-family: "NiftyFont", sans-serif !important;
        font-size: larger;
        width: 95%; // Make input take full width of parent
        border: none;
        padding: 0.5rem;
        border-radius: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        &:focus {
          outline: none; // Remove the default focus outline
          border: none; // Remove the border on focus
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Apply the box-shadow on focus
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
      flex-direction: column; // Change to column layout on mobile

      .menu-container {
        margin-bottom: 1rem; // Add spacing between menu and category selectors
      }

      .category-selectors {
        margin-left: 0; // Remove left margin on category selectors
      }

      .search-bar {
        margin-top: 1rem; // Add top margin to the search bar
      }
    }
  }
}
</style>
