import { BaseNFTModel } from './api.model';

export const MarketTemplates = [
  {
    title: 'Open-Source & DeFi',
    market: 1,
  },
  {
    title: 'Art, Events & NFTs',
    market: 2,
  },
  {
    title: 'Local Projects & DAOs',
    market: 3,
  },
];
export const CommitmentMessages = (value: number) => {
  switch (+value) {
    case 1:
      return `I got 99 problems, and a community ain't one`;
    case 2:
      return 'Billie Jean is not my lover.';
    case 3:
      return `They think I'm hiding in the shadows. But I am the shadows.`;
    case 4:
      return 'Eight or higher, bro.';
    case 5:
      return `Yes, no, maybe, I don't know. Can you repeat the question?`;
    case 6:
      return 'Pivot!';
    case 7:
      return 'You Jump, I Jump, Jack.';
    case 8:
      return 'You have my sword. And you have my bow. And my ax';
    case 9:
      return 'I’m a Mandalorian.';
    case 10:
      return '“After all this time?" "Always...”';
    default:
      return ``;
  }
};

export interface Role {
  roleName: string;
  id: number;
}

export interface RoleSet {
  roleSetName: string;
  roles: Role[];
}

export const findRoleName = (roleId: string, rolesSets: RoleSet[]) => {
  const roleSet = rolesSets.find((s) => s.roles.some((r) => r.id.toString() === roleId));
  if (roleSet) {
    const role = roleSet?.roles.find((r) => r.id.toString() === roleId);
    return role?.roleName;
  }
};

export class CommunityProperties {
  market: number | string;

  rolesSets: RoleSet[];

  commitment: number;

  address?: string;

  userData?: {
    role: string;
    roleName?: string;
    commitment: string;
    commitmentDescription?: string;
    isActive?: boolean;
  };

  additionalProps?: any;

  constructor(data: CommunityProperties) {
    if (!data) {
      this.rolesSets = [];
    } else {
      this.market = MarketTemplates[data.market]?.title;
      this.commitment = data.commitment;
      this.rolesSets = data.rolesSets;
      this.address = data.address;
      this.additionalProps = data.additionalProps;
      this.userData = data.userData || ({} as typeof this.userData);

      if (this.userData?.role) {
        this.userData.roleName = findRoleName(this.userData.role, this.rolesSets);
      }

      if (this.userData?.commitment) {
        this.userData.commitmentDescription = CommitmentMessages(+this.userData.commitment);
      }
    }
  }
}

export class Community extends BaseNFTModel<CommunityProperties> {
  constructor(data: Community = {} as Community) {
    super(data);
    this.properties = new CommunityProperties(data.properties);
  }
}

export const DefaultRoles: Role[] = [
  {
    id: 4,
    roleName: 'Core Team',
  },
  {
    id: 5,
    roleName: 'Advisor',
  },
  {
    id: 6,
    roleName: 'Investor',
  },
];
