import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useVueErd } from 'vue-mvx';
import { useMainStore } from '@/stores/mainStore';
import metadata from '@/assets/metadata/metadata.json';
import { NftMetadata, FetchedNft } from '@/types';
import { decodeBase64, parseAttributes } from '@/utils/utils';

export const useUserStore = defineStore('user', () => {
  const mainStore = useMainStore();
  const nfts = ref<NftMetadata[]>(metadata as NftMetadata[]);
  const ticker = mainStore.ticker;
  const walletNfts = ref<{ rex: NftMetadata[]; tale1: NftMetadata[]; tale2: NftMetadata[] }>({
    rex: [],
    tale1: [],
    tale2: [],
  });
  const { account, erd, fetchAccount } = useVueErd();
  const clearWallet = () => {
    walletNfts.value = {
        rex: [],
        tale1: [],
        tale2: [],
      };
  }

  const loadWalletNfts = async () => {
    if (account.logged() && account.address) {
        await fetchAccount();  // Ensure the account is fetched before making the call
    try {
        const collectionsUrl = `${erd.providers.api.url}/accounts/${account.address}/nfts?size=10000&collections=${ticker.rex},${ticker.tales}`;
        const { data: fetchedNFTs } = await axios.get<FetchedNft[]>(collectionsUrl);

        fetchedNFTs.forEach((nft) => {
          if (nft.collection === ticker.rex) {
            const matchingMetadata = nfts.value.find((meta) => meta.edition === nft.nonce);
            if (matchingMetadata) {
              walletNfts.value.rex.push(matchingMetadata);
            }
          } else if (nft.collection === ticker.tales) { 
            if (Object.keys(nft.metadata).length === 0 && nft.attributes) {
                // Decode the Base64 encoded attributes
                const decodedAttributes = decodeBase64(nft.attributes);
                // Parse the decoded attributes into an array of Attribute objects
                const attributes = parseAttributes(decodedAttributes);
            
                // Extract tags from the attributes (if present)
                const tags = attributes.find(attr => attr.trait_type.toLowerCase() === 'tags')?.value || '';
            
                // Construct the NftMetadata object
                const newNftMetadata: NftMetadata = {
                    description: nft.name, // Use NFT name as description
                    name: nft.name,
                    edition: nft.nonce,
                    dna: '', // DNA can be an empty string
                    image: nft.url,
                    attributes: attributes.filter(attr => attr.trait_type.toLowerCase() !== 'tags'), // Exclude tags from attributes
                    tags: tags,
                    rank: nft.nonce,
                    minted: 'true', // Assuming minted is always true for these NFTs
                    market: 'false', // Assuming these NFTs are not in the market
                };
            
                // Use taleVersion to determine which array to push to
                const taleVersion = nft.nonce <= 400 ? 'tale1' : 'tale2';
                walletNfts.value[taleVersion].push(newNftMetadata);
            }
            else {
                if (nft.metadata) {
                    const niftyTaleAttribute = nft.metadata.attributes.find(attribute => attribute.trait_type === 'Nifty Tale');
                    if (niftyTaleAttribute && niftyTaleAttribute.value) {
                      const taleVersion = 'tale'+niftyTaleAttribute.value.slice(1);
                      (walletNfts.value as { [key: string]: any })[taleVersion].push(nft.metadata);
                    }
                }
            }
          }
        });
      } catch (err) {
        console.error('Error loading balance NFTs:', err);
      }
    }
  };


  const loadStakedNfts = async () => {}


  return { walletNfts, loadWalletNfts, loadStakedNfts, clearWallet };
});
