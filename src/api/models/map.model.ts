import { AutOSAutID } from "./aut.model";
import { ipfsCIDToHttpUrl } from "../../utils/ipfs";

export interface AutIdInteractions {
  type: string;
  name: string;
  description: string;
  weight: string;
  status: "Complete" | "Incomplete";
}

export class MapAutID extends AutOSAutID {
  id: string;
  img?: HTMLImageElement;

  constructor(data: MapAutID) {
    super(data);
    this.id = data.id;
    const img = new Image();
    img.src = ipfsCIDToHttpUrl(data.properties.thumbnailAvatar);
    this.img = img;
  }
}
export interface MapData {
  members: MapAutID[];
  centralNode: MapAutID;
}
