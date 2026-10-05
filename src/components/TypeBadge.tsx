import { StickerType, stickerTypeInfo } from "@/types/album";

const TypeBadge = ({ type, children }: { type: StickerType; children?: React.ReactNode }) => {
  const info = stickerTypeInfo[type];

  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${info.badge}`}>
      {children ?? info.name}
    </span>
  );
};

export default TypeBadge;
