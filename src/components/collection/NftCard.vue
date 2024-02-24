<template>
  <div>
    <!-- NFT Card -->
    <div @click="openModal" class="nft-card">
      <div v-if="nft.status ==='staked'" class="ribbon ribbon-top-right">
        <span>{{ "Staked" }}</span>
      </div>
      <template v-if="isVideo(nft.image)">
        <video :src="nft.image" alt="NFT Image" class="nft-image" loop muted playsinline></video>
      </template>
      <template v-else>
        <img v-lazy="nft.image" alt="NFT Image" class="nft-image" />
      </template>
      <div class="nft-details">
        <div class="nft-info">
          <div class="nft-name">{{ splitName(nft.name).left }}</div>
          <div v-if="nft.type==='SemiFungibleESDT'">X{{ nft.balance }}</div>
          <div v-else>Rank #{{ nft.rank }}</div>
        </div>
        <div class="nft-number" v-if="splitName(nft.name).right">#{{ splitName(nft.name).right }}</div>
      </div>
    </div>

    <!-- Modal for NFT details -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="nft-image-container">
          <template v-if="isVideo(nft.image)">
        <video :src="nft.image" alt="NFT Image" class="nft-image-modal" loop muted playsinline></video>
      </template>
      <template v-else>
        <img :src="nft.image" alt="NFT Image" class="nft-image-modal" />
      </template>
        </div>
        <div class="nft-modal-info">
          <div class="nft-modal-header">
            <h1 class="nft-modal-name">{{ nft.name }}</h1>
            <h2 class="nft-modal-rank">Rank #{{ nft.rank }}</h2>
          </div>
          <div class="nft-modal-attributes">
            <table>
              <tr v-for="(row, rowIndex) in attributesInRows" :key="rowIndex" class="attribute-row">
                <td v-for="(attr, attrIndex) in row" :key="attrIndex" class="attribute">
                  <strong>{{ attr.trait_type }}</strong> <!-- trait_type is naturally above value due to the block-level display -->
                  <div>{{ attr.value }}</div> <!-- value is displayed below trait_type -->
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
  import { ref, computed } from "vue";

  // Method to split NFT name based on '#'
  const splitName = (name) => {
    const parts = name.split('#');
    if (parts.length >= 3) {
      return {
        left: parts.slice(0, 2).join('#'), // Join the first two parts (or just the first if only one '#')
        right: parts[2] || '', // The part after the second '#', if present
      };
    }
    return {
      left: parts.slice(0, 1).join('#'), // Join the first two parts (or just the first if only one '#')
      right: parts[1] || '', // The part after the second '#', if present
    };

  };

  const props = defineProps({
    nft: Object,
  });
  const isVideo = (url) => {
    return url.match(/\.(mp4)$/i) != null;
  };
  const showModal = ref(false);
  
  const openModal = () => {
    showModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false;
  };
  
  // Organize attributes into rows for display
  const attributesInRows = computed(() => {
    const rows = [];
    const attributesPerRow = 3; // Number of attributes per row
  
    for (let i = 0; i < props.nft.attributes.length; i += attributesPerRow) {
      rows.push(props.nft.attributes.slice(i, i + attributesPerRow));
    }
  
    return rows;
  });
  
  const decToHex = (dec) => {
    let hex = dec.toString(16);
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    return hex;
  };
  </script>
  
  
  <style lang="scss" scoped>
  .nft {
    &-image {
      width: 8rem;
      border-radius: 0.2rem;
      &-modal {
        width: 20rem;
        height: auto;
        border-radius: 0.3rem;
      }
    }
    &-card {
      padding: 0.3rem;
      position: relative;
      margin: 0.25rem;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.07);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      &:hover {
        transform: rotate3d(5, 10, 0, 15deg); // Slight 3D tilt
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); // Enhanced shadow for lifted effect
      }
    }
    &-details {
      margin-top: 0.3rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    &-info {
      display: flex;
      flex-direction: column;
    }
    &-number {
      margin-left: auto;
    }
  }
  
  .nft-card {
    flex-basis: calc(33.33% - 1rem); 
  
    @media (max-width: 768px) {
      flex-basis: calc(50% - 1rem); 
    }
  
    @media (max-width: 480px) {
      flex-basis: 100%;
    }
  }
  
  .modal {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    &-content {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .attribute {
    flex-grow: 1; /* Allow attribute to grow and take available space */
    background-color: #eeeeee;
    border-radius: 0.3rem;
    padding: 0.5rem;
    margin: 0.1rem;
    text-align: center;

    /* Use flexbox to evenly distribute space when there are fewer than 3 attributes */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
  .nft {
    &-image {
      &-modal {
        width: auto;
        max-height: 18rem;
        border-radius: 0.3rem;
      }
    }
    &-traits {
      margin-left: 20px;
    }
    &-modal {
      &-info {
        max-width: 20rem; 
        max-height: 50rem;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
      }
      &-name {
        font-size: 1.5em;
        font-weight: bold;
      }
      &-header {
        text-align: left;
      }
      &-rank {
        font-size: 1.2em;
        margin-top: 10px;
      }
      &-attributes {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
        text-align: center;
        max-width: 25rem;
      }
    }
    table {
        border-collapse: collapse;
        border-spacing: 10px;
    }
    tr {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    td {
      background-color: #999999;
      padding: 5px 0px !important;
      border-radius: 5px;
      strong {
        display: block;
      }
    }
    .last-child {
      background-color: #999999;
      padding: 5px 10px;
      border-radius: 5px;
      text-align: center;
      width: auto; 
    }
  }

  .ribbon {
  user-select: none;
  width: 150px;
  height: 150px;
  overflow: hidden;
  position: absolute;
  width: 112px !important; // You have two width declarations, consider which one is necessary
  height: 112px !important; // Same as above for height

  &::before,
  &::after {
    position: absolute;
    z-index: -1;
    content: '';
    display: block;
    border: 5px solid #296877;
  }

  span {
    position: absolute;
    display: block;
    width: 225px;
    padding: 15px 0;
    background: linear-gradient(54.65deg, #9cd7e6 10.41%, #c4f3ff 28.41%, #9adff0 46.71%, #66bed4 68.01%);
    color: rgb(255, 255, 255);
    font-size: larger;
    text-shadow: 0 1px 1px rgba(0,0,0,.2);
    text-transform: uppercase;
    text-align: center;
  }

  &-top-right {
    top: -10px;
    right: -10px;

    span {
      left: -45px; 
      top: 17px; 
      transform: rotate(45deg);
      padding: 7px !important; 
    }

    &::before {
      left: 11px !important; 
      border-top-color: transparent;
      border-right-color: transparent;
      top: 0;
    }

    &::after {
      bottom: 11px !important; 
      border-top-color: transparent;
      border-right-color: transparent;
      right: 0; 
    }
  }
}

  </style>
  