import fs from "fs";

import { FILE_PATH } from "../lib/constants.js";

export function updateRecord(id, updateFn) {
    if (!fs.existsSync(FILE_PATH))
        fs.writeFileSync(FILE_PATH, '', 'utf-8');

    const data = fs.readFileSync(FILE_PATH, 'utf-8');

    if (!data) {
        throw new Error('No data available');
    }
    
    let isRecordFound = false;

    const lines = data.trim().split('\n');
    const updatedLines = lines.map((line) => {
        const clip = JSON.parse(line);

        if (clip.id === id) {
            isRecordFound = true;
            return JSON.stringify(updateFn(clip));
        }

        return JSON.stringify(clip);
    });

    fs.writeFileSync(FILE_PATH, updatedLines.join('\n'), 'utf-8');

    return isRecordFound;
}