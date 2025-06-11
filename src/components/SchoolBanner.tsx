const SchoolBanner = ({ warning, bgWarningColor }: { warning: string | null, bgWarningColor: string | null }) => {
    return warning && bgWarningColor ? (
        <div className={` py-3 px-4 shadow-md mt-16 mb-5 fixed top-0 left-0 right-0 z-10`} style={{ background: bgWarningColor }}>
            <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-sm md:text-base font-medium">
                        {warning}
                    </p>
                </div>
            </div>
        </div>
    ) : null;
}

export default SchoolBanner;