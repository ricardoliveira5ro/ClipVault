import fs from "fs";
import chalk from "chalk";

import { FILE_PATH } from "../lib/constants.js";

export function pin(id) {
    try {
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
                clip.isPinned = true;
                isRecordFound = true;
            }

            return JSON.stringify(clip);
        });

        fs.writeFileSync(FILE_PATH, updatedLines.join('\n'), 'utf-8');

        console.log(isRecordFound ? chalk.bgGreen(`Clipboard entry ${id} pinned successfully`) : chalk.bgRed(`Could not found with id ${id}`));

    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the pin command:'), chalk.red(err.message));
    }
}