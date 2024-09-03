import {
  DAutAutID,
  AutIDProperties as BaseAutIDProperties
} from "@aut-labs/d-aut";
import { AutOSHub } from "./hub.model";
import { AutIdInteractions } from "./map.model";

export class AutIDProperties extends BaseAutIDProperties {
  ethDomain: string;
  interactions: AutIdInteractions[];
  hubs: AutOSHub[];
  constructor(data: AutIDProperties) {
    super(data);
    this.ethDomain = data.ethDomain;
    this.interactions = data.interactions;
    this.hubs = data.hubs;
  }
}

export class AutOSAutID<T = AutIDProperties> extends DAutAutID<T> {
  constructor(data: AutOSAutID<T> = {} as AutOSAutID<T>) {
    super(data);
    this.properties = new AutIDProperties(
      data.properties as AutIDProperties
    ) as T;
  }

  selectedHub(hubAddress: string) {
    if (!(this.properties as AutIDProperties).hubs) return null;
    return (this.properties as AutIDProperties).hubs.find(
      (hub) =>
        hub.properties.address?.toLowerCase() === hubAddress?.toLowerCase()
    );
  }

  joinedHub(hubAddress: string) {
    if (!(this.properties as AutIDProperties).hubs) return null;
    return (this.properties as AutIDProperties).joinedHubs.find(
      (hub) => hub.hubAddress?.toLowerCase() === hubAddress?.toLowerCase()
    );
  }

  isAutIDOwner(address: string) {
    return (
      (this.properties as AutIDProperties).address?.toLowerCase() ===
      address?.toLowerCase()
    );
  }
}
