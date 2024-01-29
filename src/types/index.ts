// Assuming this file is saved in your project as src/types/index.ts

export interface Attribute {
    trait_type: string;
    value: string;
  }
  
  export interface NftMetadata {
    description: string;
    name: string;
    edition: number;
    dna: string;
    image: string;
    attributes: Attribute[];
    tags: string;
    rank: number;
    minted: string;
    market: string;
  }
  