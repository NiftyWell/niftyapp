import { NftMetadata } from '@/types';

export interface StakedNft extends NftMetadata {
    pool_id: number;
    epoch: number;
    last_claim_epoch: number;
}

export interface UnstakedNft extends NftMetadata {
    unstake_timestamp: number;
    old_pool_id: number;
}
