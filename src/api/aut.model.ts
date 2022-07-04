import { BaseNFTModel, ipfsCIDToHttpUrl } from './api.model';
import { Community } from './community.model';

export interface AutSocial {
  type: string;
  link: string;
}

export const DefaultSocials: AutSocial[] = [
  // {
  //   type: 'eth',
  //   link: '',
  // },
  {
    type: 'discord',
    link: '',
  },
  {
    type: 'github',
    link: '',
  },
  {
    type: 'twitter',
    link: '',
  },
  {
    type: 'telegram',
    link: '',
  },
  {
    type: 'leaf',
    link: '',
  },
];

export class AutIDProperties {
  avatar: string;

  communities: Community[];

  timestamp: string;

  address: string;

  tokenId: string;

  socials: AutSocial[];

  ethDomain?: string;

  constructor(data: AutIDProperties) {
    if (!data) {
      this.communities = [];
      this.socials = [];
    } else {
      this.timestamp = data.timestamp;
      this.avatar = ipfsCIDToHttpUrl(data.avatar);
      this.address = data.address;
      this.tokenId = data.tokenId;
      this.communities = (data.communities || []).map((community) => new Community(community));
      this.ethDomain = data.ethDomain;
      this.socials = data.socials || DefaultSocials;
      this.socials = this.socials.filter((s) => s.type !== 'eth');
    }
  }
}

export class AutID extends BaseNFTModel<AutIDProperties> {
  constructor(data: AutID = {} as AutID) {
    super(data);
    this.properties = new AutIDProperties(data.properties);
  }
}
