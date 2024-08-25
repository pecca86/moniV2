const MoniBanner = ({ children, style }: { children: any, style: string }) => {

    const warningStyle = "my-2 text-gray-800 border-solid border-2 border-red-200 p-2 rounded-lg shadow-md bg-red-100";
    const infoStyle = "my-2 text-gray-800 border-solid border-2 border-blue-200 p-2 rounded-lg shadow-md bg-blue-100";
    const successStyle = "my-2 text-gray-800 border-solid border-2 border-green-200 p-2 rounded-lg shadow-md bg-green-100";

    let selectedStyle;
    switch (style) {
        case 'warning':
            selectedStyle = warningStyle;
            break;
        case 'info':
            selectedStyle = infoStyle;
            break;
        case 'success':
            selectedStyle = successStyle;
            break;
        default:
            selectedStyle = warningStyle;
    }

    return (
        <div className={selectedStyle}>
            {children}
        </div>
    );
}

export default MoniBanner;
