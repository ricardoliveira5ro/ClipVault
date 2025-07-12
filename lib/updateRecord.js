import fs from "fs";

import { readFileInit } from "./utils.js";
import { FILE_PATH } from "../lib/constants.js";

export function updateRecord(id, updateFn) {
    const data = readFileInit();
    
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

    fs.writeFileSync(FILE_PATH, updatedLines.join('\n') + '\n', 'utf-8');

    return isRecordFound;
}