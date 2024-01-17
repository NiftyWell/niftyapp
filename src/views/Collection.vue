<template>
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
</style>
