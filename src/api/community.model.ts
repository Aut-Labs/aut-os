import { CommitmentMessages } from "@utils/misc";
import { httpUrlToIpfsCID } from "./storage.api";
import { BaseNFTModel } from "@aut-labs/sdk/dist/models/baseNFTModel";
import { AutSocial } from "./social.model";
import { RoleSet, NovaProperties, Role } from "@aut-labs/sdk/dist/models/nova";

export const MarketTemplates = [
  {
    title: "Open-Source & Infra",
    market: 1
    // icon: OpenSource
  },
  {
    title: "DeFi & Payments",
    market: 2
    // icon: Defi
  },
  {
    title: "ReFi & Governance",
    market: 3
    // icon: Refi
  },
  {
    title: "Social, Art & Gaming",
    market: 4
    // icon: Social
  },
  {
    title: "Identity & Reputation",
    market: 5
    // icon: Identity
  }
];

export const findRoleName = (roleId: string, rolesSets: RoleSet[]) => {
  const roleSet = (rolesSets || []).find((s) =>
    s.roles.some((r) => r.id.toString() === roleId)
  );
  if (roleSet) {
    const role = roleSet?.roles.find((r) => r.id.toString() === roleId);
    return role?.roleName;
  }
};

export class CommunityProperties extends NovaProperties {
  address?: string;

  socials: AutSocial[];

  userData?: Partial<{
    role: string;
    roleName?: string;
    commitment: string;
    isAdmin: boolean;
    commitmentDescription?: string;
    isActive?: boolean;
  }>;

  additionalProps?: any;

  constructor(data: CommunityProperties) {
    super(data);
    if (!data) {
      this.rolesSets = [];
    } else {
      this.market = MarketTemplates[data.market]?.title;
      this.commitment = data.commitment;
      this.rolesSets = data.rolesSets;
      this.address = data.address;
      this.additionalProps = data.additionalProps;
      this.userData =
        JSON.parse(JSON.stringify(data.userData)) ||
        ({} as typeof this.userData);

      if (this.userData?.role) {
        this.userData.roleName = findRoleName(
          this.userData.role,
          this.rolesSets
        );
      }

      if (this.userData?.commitment) {
        this.userData.commitmentDescription = CommitmentMessages(
          +this.userData.commitment
        );
      }
      this.socials = data.socials;
      this.userData.isAdmin = data.userData.isAdmin;
    }
  }
}

export class Community extends BaseNFTModel<CommunityProperties> {
  static updateCommunity(updatedCommunity: Community): Partial<Community> {
    const community = new Community(updatedCommunity);
    const market = MarketTemplates.find(
      (v) => v.title === community.properties.market
    );
    return {
      name: community.name,
      description: community.description,
      image: httpUrlToIpfsCID(community.image as string),
      properties: {
        market: market?.title || 0,
        commitment: community.properties.commitment,
        rolesSets: community.properties.rolesSets
      }
    } as Partial<Community>;
  }

  constructor(data: Community = {} as Community) {
    super(data);
    this.properties = new CommunityProperties(data.properties);
  }
}

export const DefaultRoles: Role[] = [
  {
    id: 4,
    roleName: "Core Team"
  },
  {
    id: 5,
    roleName: "Advisor"
  },
  {
    id: 6,
    roleName: "Investor"
  }
];
