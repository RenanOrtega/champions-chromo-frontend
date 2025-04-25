import { Album, Sticker } from "../album";

export interface CartItem {
  album: Album;
  stickers: Sticker[];
}