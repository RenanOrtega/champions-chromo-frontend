import { School } from "@/types/school";
import { createContext, ReactNode, useContext, useState, useCallback } from "react";

interface SchoolBannerState {
    warning: string | null;
    bgWarningColor: string | null;
}

interface BannerContextType extends SchoolBannerState {
    setSchoolBanner: (school: School) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
    const [bannerState, setBannerState] = useState<SchoolBannerState>({
        warning: null,
        bgWarningColor: null,
    });

    const setSchoolBanner = useCallback((school: School) => {
        if (school.warning && school.bgWarningColor) {
            setBannerState({
                warning: school.warning,
                bgWarningColor: school.bgWarningColor,
            });
        } else {
            setBannerState({
                warning: null,
                bgWarningColor: null,
            });
        }
    }, []);

    return (
        <BannerContext.Provider
            value={{
                ...bannerState,
                setSchoolBanner
            }}
        >
            {children}
        </BannerContext.Provider>
    );
};

export const useSchoolBanner = () => {
    const context = useContext(BannerContext);
    if (context === undefined) {
        throw new Error('useSchoolBanner must be used inside of a BannerProvider');
    }
    return context;
};
