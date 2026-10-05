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

export type StickerType = 'common' | 'legend' | 'a4';

export interface Sticker {
  id: string;
  albumId: string;
  number: string;
  name: string;
  type: StickerType;
  price: number;
}

// Cada tipo tem uma cor fixa em toda a loja: Comum cinza, Legend âmbar, A4 azul.
export const stickerTypeInfo = {
  'common': { name: 'Comum', price: 1, badge: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400' },
  'legend': { name: 'Legend', price: 5, badge: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  'a4': { name: 'A4', price: 15, badge: 'bg-primary-50 text-primary-700 border-primary-200', dot: 'bg-primary-500' }
};

export const stickerTypes: StickerType[] = ['common', 'legend', 'a4'];

export const albumHasType = (album: Album, type: StickerType) =>
  type === 'common' ? album.hasCommon : type === 'legend' ? album.hasLegend : album.hasA4;
