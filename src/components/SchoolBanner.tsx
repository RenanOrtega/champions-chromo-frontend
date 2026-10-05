import { Info } from "lucide-react";

const SchoolBanner = ({ warning, bgWarningColor }: { warning: string | null, bgWarningColor: string | null }) => {
    return warning && bgWarningColor ? (
        <div role="status" className="border-b border-black/10 px-4 py-2.5" style={{ background: bgWarningColor }}>
            <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
                <Info className="size-4 shrink-0" />
                <p className="text-sm font-medium">
                    {warning}
                </p>
            </div>
        </div>
    ) : null;
}

export default SchoolBanner;
