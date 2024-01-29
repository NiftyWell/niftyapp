// src/utils/search.ts
import { NftMetadata } from "@/types"; // Ensure this path matches where your NftMetadata type is defined

const preprocessText = (text: string): string[] => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/);
};

const preprocessNfts = (nfts: NftMetadata[]): string[][] => {
    return nfts.map(nft => {
      let attributesText = nft.attributes.map(attr => `${attr.trait_type.toLowerCase()}:${attr.value.toLowerCase()}`).join(" ");
      return preprocessText(`${nft.description} ${nft.name} ${attributesText} ${nft.tags} edition:${nft.edition} rank:${nft.rank}`);
    });
};

const computeTF = (document: string[]): Record<string, number> => {
    const tf: Record<string, number> = {};
    document.forEach(term => {
        tf[term] = (tf[term] || 0) + 1;
    });
    const docLength = document.length;
    Object.keys(tf).forEach(term => {
        tf[term] = tf[term] / docLength;
    });
    return tf;
};

const computeIDF = (documents: string[][]): Record<string, number> => {
    const idf: Record<string, number> = {};
    const totalDocuments = documents.length;
    documents.forEach(doc => {
        new Set(doc).forEach(term => {
            idf[term] = (idf[term] || 0) + 1;
        });
    });
    Object.keys(idf).forEach(term => {
        idf[term] = Math.log(totalDocuments / idf[term]);
    });
    return idf;
};

const computeTFIDF = (tf: Record<string, number>, idf: Record<string, number>): Record<string, number> => {
    const tfidf: Record<string, number> = {};
    Object.keys(tf).forEach(term => {
        tfidf[term] = tf[term] * (idf[term] || 0);
    });
    return tfidf;
};

export const searchNfts = (nfts: NftMetadata[], query: string): NftMetadata[] => {
    if (!query.trim()) return nfts;

    // Normalize the query for exact matching (remove spaces and convert to lowercase)
    const normalizedQuery = query.replace(/\s+/g, '').toLowerCase();

    // First, find NFTs that exactly match the query
    const exactMatches = nfts.filter(nft => {
        // Create a single string from all relevant metadata fields for comparison
        let metadataString = `${nft.name}${nft.description}${nft.attributes.map(attr => attr.value).join('')}${nft.tags}edition:${nft.edition}rank:${nft.rank}`;
        metadataString = metadataString.replace(/\s+/g, '').toLowerCase(); // Normalize metadata string

        // Check for exact match
        return metadataString.includes(normalizedQuery);
    });

    // If exact matches are found, return them immediately
    if (exactMatches.length > 0) {
        return exactMatches;
    }

    // If no exact matches, proceed with broader search
    const queryTerms = preprocessText(query);
    const documents = preprocessNfts(nfts);

    return nfts.filter((_, index) => {
        const docText = documents[index].join(" ");
        return queryTerms.every(term => docText.includes(term));
    });
};
