<template>
    <div>
      <!-- NFT Card -->
      <div @click="openModal" class="nft-card">
        <img :src="nft.image" alt="NFT Image" class="nft-image" />
        <div class="nft-details">
          <div class="nft-info">
            <div class="nft-name">{{ nft.name.split("#")[0] }}</div>
            <div>Rank #{{ nft.rank }}</div>
          </div>
          <div class="nft-number">#{{ nft.name.split("#")[1] }}</div>
        </div>
      </div>
  
      <!-- Modal for NFT details -->
      <div v-if="showModal" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="nft-image-container">
            <img :src="nft.image" alt="NFT Image" class="nft-image-modal" />
          </div>
          <div class="nft-modal-info">
            <div class="nft-modal-header">
              <h1 class="nft-modal-name">{{ nft.name }}</h1>
              <h2 class="nft-modal-rank">Rank #{{ nft.rank }}</h2>
            </div>
            <div class="nft-modal-attributes">
              <table>
                <!-- First row of attributes (3 attributes) -->
                <tr class="attribute-row">
                  <td class="attribute" v-if="getAttribute('Body')">
                    <strong>Body</strong>
                    <div>{{ getAttribute("Body") }}</div>
                  </td>
                  <td class="attribute" v-if="getAttribute('Tail')">
                    <strong>Tail</strong>
                    <div>{{ getAttribute("Tail") }}</div>
                  </td>
                  <td class="attribute" v-if="getAttribute('Shirt')">
                    <strong>Shirt</strong>
                    <div>{{ getAttribute("Shirt") }}</div>
                  </td>
                </tr>
                <!-- Second row of attributes (3 attributes) -->
                <tr class="attribute-row">
                  <td class="attribute" v-if="getAttribute('Hat')">
                    <strong>Hat</strong>
                    <div>{{ getAttribute("Hat") }}</div>
                  </td>
                  <td class="attribute" v-if="getAttribute('Face')">
                    <strong>Face</strong>
                    <div>{{ getAttribute("Face") }}</div>
                  </td>
                  <td class="attribute" v-if="getAttribute('Eyes')">
                    <strong>Eyes</strong>
                    <div>{{ getAttribute("Eyes") }}</div>
                  </td>
                </tr>
                <!-- Background attribute (full width) -->
                <tr>
                  <td colspan="3" class="attribute last-child" v-if="getAttribute('Background')">
                    <strong>Background</strong>
                    <div>{{ getAttribute("Background") }}</div>
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
  import { ref } from "vue";
  
  const props = defineProps({
    nft: Object,
  });
  
  const showModal = ref(false);
  
  const openModal = () => {
    showModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false;
  };
  const getAttribute = (type) => {
    const attribute = props.nft.attributes.find(
      (attr) => attr.trait_type === type,
    );
    return attribute ? attribute.value : null;
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
    background-color: #eeeeee;
    border-radius: 0.3rem;
    padding: 0.5rem;
    margin: 0.5rem 0; 
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
  </style>
  