import { BaseNFTModel } from "@aut-protocol/sdk/dist/models/baseNFTModel";
import { CommunityMembershipDetails } from "@aut-protocol/sdk/dist/models/holder";
import { Community } from "./community.model";
import { httpUrlToIpfsCID } from "./storage.api";
import { AutSocial, DefaultSocials, socialUrls } from "./social.model";

export interface HolderData {
  daos: CommunityMembershipDetails[];
  address: string;
  tokenId: string;
  metadataUri: string;
}

export class AutIDProperties {
  avatar: string;

  communities: Community[];

  timestamp: string;

  address: string;

  tokenId: string;

  socials: AutSocial[];

  ethDomain?: string;

  network?: string;

  holderData?: HolderData;

  constructor(data: AutIDProperties) {
    if (!data) {
      this.communities = [];
      this.socials = [];
    } else {
      this.timestamp = data.timestamp;
      this.avatar = data.avatar;
      this.address = data.address;
      this.tokenId = data.tokenId;
      this.communities = (data.communities || []).map(
        (community) => new Community(community)
      );
      this.ethDomain = data.ethDomain;
      this.socials = data.socials || DefaultSocials;
      this.socials = this.socials.filter((s) => s.type !== "eth");
      this.network = data.network;
      this.holderData = data.holderData;
    }
  }
}

export class AutID extends BaseNFTModel<AutIDProperties> {
  static updateAutID(updatedUser: AutID): Partial<AutID> {
    const autID = new AutID(updatedUser);
    return {
      name: autID.name,
      description: autID.description,
      image: httpUrlToIpfsCID(autID.image as string),
      properties: {
        avatar: httpUrlToIpfsCID(autID.properties.avatar as string),
        timestamp: autID.properties.timestamp,
        socials: autID.properties.socials.map((social) => {
          social.link = `${socialUrls[social.type].prefix}${social.link}`;
          return social;
        })
      }
    } as Partial<AutID>;
  }

  constructor(data: AutID = {} as AutID) {
    super(data);
    this.properties = new AutIDProperties(data.properties);
  }
}
