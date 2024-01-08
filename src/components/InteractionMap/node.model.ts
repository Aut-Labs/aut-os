import { AutId } from "@api/map.model";

export interface MapNode extends AutId {
  pl: number;
  size: number;
  color: string;
}

export interface MapLink {
  is: number;
}
