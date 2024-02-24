
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
    balance?: number; // Optional balance attribute for puzzle pieces
    type?: string; // Add the type here using the enum
    status?: string;
}

export interface Attribute {
    trait_type: string;
    value: string;
}
