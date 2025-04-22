export interface Sticker {
  id: number;
  type: 'common' | 'legend' | 'quadro' | 'a4';
  image: string;
  price: number;
}

export interface Album {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  year: string;
}

export interface CartItem {
  album: Album;
  stickers: Sticker[];
}