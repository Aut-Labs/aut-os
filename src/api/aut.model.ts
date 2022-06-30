import { BaseNFTModel, ipfsCIDToHttpUrl } from './api.model';
import { Community } from './community.model';

export class AutIDProperties {
  avatar: string;

  communities: Community[];

  timestamp: string;

  address: string;

  tokenId: string;

  constructor(data: AutIDProperties) {
    if (!data) {
      this.communities = [];
    } else {
      this.timestamp = data.timestamp;
      this.avatar = ipfsCIDToHttpUrl(data.avatar);
      this.address = data.address;
      this.tokenId = data.tokenId;
      this.communities = (data.communities || []).map((community) => new Community(community));
    }
  }
}

export class AutID extends BaseNFTModel<AutIDProperties> {
  constructor(data: AutID = {} as AutID) {
    super(data);
    this.properties = new AutIDProperties(data.properties);
  }
}
