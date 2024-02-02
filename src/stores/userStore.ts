import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useVueErd } from 'vue-mvx';
import { useMainStore } from '@/stores/mainStore';
import metadata from '@/assets/metadata/metadata.json';
import { NftMetadata, FetchedNft } from '@/types';
import { decodeBase64, parseAttributes } from '@/utils/utils';

export const useUserStore = defineStore('user', () => {
  const { account, erd, fetchAccount } = useVueErd();
  const mainStore = useMainStore();
  const nfts = ref<NftMetadata[]>(metadata as NftMetadata[]);
  const ticker = mainStore.ticker;
  const walletNfts = ref<{
    rex: NftMetadata[];
    tale: { [key: number]: NftMetadata[] };
    puzzle: { [key: number]: NftMetadata[] };
  }>({
    rex: [],
    tale: {},
    puzzle: {},
  });
  
  const clearWallet = () => {
    walletNfts.value = {
        rex: [],
        tale: {},
        puzzle: {},
      };
  }

  const loadWalletNfts = async () => {
    if (account.logged() && account.address) {
      await fetchAccount(); // Ensure the account is fetched before making the call
      try {
        clearWallet();
        const collectionsUrl = `${erd.providers.api.url}/accounts/${/*account.address*/'erd1ct86m5x3w60epnny9us89uqpysjpefuncx82ldhd2l4mznq2rt9q9eh9qx'}/nfts?size=10000&collections=${ticker.rex},${ticker.tales},${ticker.puzzle}`;
        const { data: fetchedNFTs } = await axios.get<FetchedNft[]>(collectionsUrl);
        fetchedNFTs.forEach((nft) => {
            if (nft.collection === ticker.rex) {
              const matchingMetadata = nfts.value.find((meta) => meta.edition === nft.nonce);
              if (matchingMetadata) {
                matchingMetadata.type = "NonFungibleESDT";
                walletNfts.value.rex.push(matchingMetadata);
              }
            } else if (nft.collection === ticker.tales || nft.collection === ticker.puzzle) {
              const decodedAttributes = decodeBase64(nft.attributes);
              const attributes = parseAttributes(decodedAttributes);
              const tags = attributes.find((attr) => attr.trait_type.toLowerCase() === 'tags')?.value || '';
              
              let newNftMetadata;
              
              if (Object.keys(nft.metadata).length === 0) {
                // If nft.metadata is an empty object, add the balance based on nft.type
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
                  balance: nft.type === 'NonFungibleESDT' ? 1 : nft.balance, // Set balance based on nft.type
                  type: nft.type,
                };
              } else {
                // If nft.metadata is not an empty object, use it as is
                newNftMetadata = nft.metadata;
                newNftMetadata.type = nft.type;
                newNftMetadata.balance = nft.type === 'NonFungibleESDT' ? 1 : nft.balance; // Set balance based on nft.type
                newNftMetadata.rank = nft.rank;
                console.log("newNftMetadata is:", newNftMetadata);
              }
              
              // Extract edition number from NFT name
              const editionMatch = nft.name.match(/#(\d+)/);
              const edition = editionMatch ? parseInt(editionMatch[1], 10) : 1; // Default to 1 if not found
          
              const collectionType = nft.collection === ticker.tales ? 'tale' : 'puzzle';
          
              if (!walletNfts.value[collectionType][edition]) {
                walletNfts.value[collectionType][edition] = [];
              }
          
              walletNfts.value[collectionType][edition].push(newNftMetadata);
            }
          });
      } catch (err) {
        console.error('Error loading wallet NFTs:', err);
      }
    }
  };
  


  const loadStakedNfts = async () => {}


  return { walletNfts, loadWalletNfts, loadStakedNfts, clearWallet };
});
