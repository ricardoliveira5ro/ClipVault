import fs from "fs";
import { FILE_PATH } from "./constants.js";

export function readFileInit() {
    if (!fs.existsSync(FILE_PATH))
        fs.writeFileSync(FILE_PATH, '', 'utf-8');

    const data = fs.readFileSync(FILE_PATH, 'utf-8');

    if (!data) {
        throw new Error('No data available');
    }

    return data;
}

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

export function getCutOffDate(numDays) {
    const now = new Date();
    now.setDate(now.getDate() - numDays);
    
    return now;
}