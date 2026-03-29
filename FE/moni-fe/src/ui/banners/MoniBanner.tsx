const MoniBanner = ({ children, style }: { children: any, style: string }) => {
    const styles: Record<string, string> = {
        warning: "flex items-start gap-2 my-2 text-sm text-[#DF1B41] border border-[#FECDD3] bg-[#FFF0F3] px-4 py-3 rounded-lg",
        info: "flex items-start gap-2 my-2 text-sm text-[#0055DE] border border-[#BFDBFE] bg-[#EEF4FF] px-4 py-3 rounded-lg",
        success: "flex items-start gap-2 my-2 text-sm text-[#09825D] border border-[#A7F3D0] bg-[#D7F7EE] px-4 py-3 rounded-lg",
    };

    return (
        <div className={styles[style] ?? styles.warning}>
            {children}
        </div>
    );
}

export default MoniBanner;
