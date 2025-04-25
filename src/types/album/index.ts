export interface Album {
  id: string;
  schoolId: string;
  name: string;
  price: number;
  releaseDate: string;
  coverImage: string;
  commonStickers: StickerItem[];
  frameStickers: StickerItem[];
  legendStickers: StickerItem[];
  a4Stickers: StickerItem[];
  totalStickers: number;
}

export interface StickerItem {
  number: number;
  name: string;
}

export interface Sticker {
  id: string;
  albumId: string;
  number: number;
  name: string;
  type: 'common' | 'frame' | 'legend' | 'a4';
  price: number;
}