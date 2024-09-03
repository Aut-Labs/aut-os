import { Role } from "@aut-labs/sdk/dist/models/role";
import { AutOSAutID } from "./aut.model";
import { DAutHub, HubProperties as BaseHubProperties } from "@aut-labs/d-aut";

interface MarketTemplate {
  title: string;
  market: number;
  // icon: any;
}

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

export class HubProperties extends BaseHubProperties {
  members: AutOSAutID[];
  metadataUri: string;

  constructor(data: HubProperties) {
    super(data);
    this.members = data.members;
    this.metadataUri = data.metadataUri;
  }
}

export class AutOSHub<T = HubProperties> extends DAutHub<T> {
  constructor(data: AutOSHub<T> = {} as AutOSHub<T>) {
    super(data);
    this.properties = new HubProperties(data.properties as HubProperties) as T;
  }

  get roles(): Role[] {
    return (this.properties as HubProperties).rolesSets[0].roles;
  }

  get marketTemplate(): MarketTemplate {
    const markeId = +(this.properties as HubProperties).market;
    return MarketTemplates.find((template) => template.market === markeId);
  }

  isMember(autIDAddress: string): boolean {
    if (!autIDAddress) return false;
    return (this.properties as HubProperties).members.some(
      (member) =>
        member.properties.address?.toLowerCase() === autIDAddress?.toLowerCase()
    );
  }

  roleName(roleId: number): string {
    return this.roles.find((role) => +role.id === +roleId)?.roleName || "";
  }
}
