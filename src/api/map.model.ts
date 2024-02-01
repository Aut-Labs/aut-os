import { AutID } from "./aut.model";
import { Community } from "./community.model";
import { ipfsCIDToHttpUrl } from "./storage.api";

export interface AutIdInteractions {
  type: string;
  name: string;
  description: string;
  weight: string;
  status: "Complete" | "Incomplete";
}

export class MapAutID extends AutID {
  id: string;
  nova: MapNova;
  img?: HTMLImageElement;

  constructor(data: MapAutID) {
    super(data);
    this.nova = data.nova;
    this.id = data.id;
    const img = new Image();
    img.src = ipfsCIDToHttpUrl(data.properties.thumbnailAvatar);
    this.img = img;
  }
}
export interface MapNova extends Community {
  members: MapAutID[];
  centralNode: MapAutID;
}
