import { TokenInput } from 'nft.storage/dist/src/lib/interface';

export interface HolderCommunity {
  communityExtension: string;
  holderRole: string;
  holderCommitment: string;
  holderIsActive: boolean;
  contractType: string;
  daoAddress: string;
  metadata: string;
  market: string;
  discordServer: string;
}

export interface HolderData {
  communities: HolderCommunity[];
  address: string;
  tokenId: string;
  metadataUri: string;
}

export class BaseNFTModel<Properties> implements Omit<TokenInput, 'image'> {
  name: string;

  description: string;

  image: File | string;

  properties: Properties;

  constructor(data: BaseNFTModel<Properties>) {
    this.name = data.name;
    this.description = data.description;
    this.image = data.image as string;
    this.properties = data.properties;
  }
}
