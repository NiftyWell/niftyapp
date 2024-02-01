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

export interface Attribute {
    trait_type: string;
    value: string;
}

export interface TaleMetadata {
    name: number;
    nonce: number;
    ticker: string;
    media: string;
    tale: number;
}

