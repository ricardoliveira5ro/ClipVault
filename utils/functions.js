export function formatSize(bytes) {
    if (bytes < 1024) 
        return `${bytes} B`;

    if (bytes < 1024 * 1024) 
        return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}