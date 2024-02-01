// src/types/index.ts
import { NftMetadata } from '@/types';

export interface FetchedNft {
    identifier: string;
    collection: string;
    timestamp: number;
    attributes: string; // This might be a Base64 encoded string based on your example
    nonce: number;
    type: string;
    name: string;
    creator: string;
    royalties: number;
    uris: string[];
    url: string;
    media: NftMedia[];
    isWhitelistedStorage: boolean;
    tags: string[];
    metadata: NftMetadata; // Reusing the NftMetadata interface you already have
    owner: string;
    ticker: string;
    score: number;
    rank: number;
    rarities: NftRarities;
    isNsfw: boolean;
    assets: NftAssets;
  }
  
  export interface NftMedia {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
  }
  
  export interface NftRarities {
    trait: NftRarityScore;
    statistical: NftRarityScore;
    jaccardDistances: NftRarityScore;
    openRarity: NftRarityScore;
  }
  
  export interface NftRarityScore {
    rank: number;
    score: number;
  }
  
  export interface NftAssets {
    website: string;
    description: string;
    status: string;
    pngUrl: string;
    svgUrl: string;
    social: NftSocialLinks;
  }
  
  export interface NftSocialLinks {
    twitter?: string;
    discord?: string;
  }
  