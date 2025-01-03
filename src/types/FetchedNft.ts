import { NftMetadata } from '@/types';

export interface FetchedNft {
    identifier: string;
    collection: string;
    timestamp: number;
    attributes: string;
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
    metadata: NftMetadata;
    owner: string;
    ticker: string;
    score: number;
    rank: number;
    rarities: NftRarities;
    isNsfw: boolean;
    assets: NftAssets;
    balance?: number; // Optional balance attribute for puzzle pieces
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
  