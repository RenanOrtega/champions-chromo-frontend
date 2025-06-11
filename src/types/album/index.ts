export interface Album {
  id: string;
  schoolId: string;
  name: string;
  releaseDate: string;
  coverImage: string;
  commonPrice: number;
  legendPrice: number;
  a4Price: number;
  totalStickers: number;
  hasCommon: boolean;
  hasLegend: boolean;
  hasA4: boolean;
}

export interface Sticker {
  id: string;
  albumId: string;
  number: string;
  name: string;
  type: 'common' | 'legend' | 'a4';
  price: number;
}

export const stickerTypeInfo = {
  'common': { name: 'Comum', price: 1 },
  'legend': { name: 'Legend', price: 5 },
  'a4': { name: 'A4', price: 15 }
};