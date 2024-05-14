import { AutID } from "@api/aut.model";
import { MapAutID } from "@api/map.model";

export interface MapNode extends MapAutID {
  pl: number;
  size: number;
  color: string;
}

export interface MapLink {
  is: number;
}
