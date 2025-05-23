export interface Album {
  id: string;
  schoolId: string;
  name: string;
  releaseDate: string;
  coverImage: string;
  totalStickers: number;
}

export interface Sticker {
  id: string;
  albumId: string;
  number: string;
  name: string;
  type: 'common' | 'legend' | 'a4';
  price: number;
}