import chalk from "chalk";
import fs from "fs";

import { getCutOffDate, isNumeric, readFileInit } from "../lib/utils.js";
import { FILE_PATH } from "../lib/constants.js";

export function clear(options) {
    try {
        if (options.days && (!isNumeric(options.days) || parseInt(options.days) <= 0)) {
            throw new Error('Invalid option \'days\'. It must be a positive number');
        }

        const data = readFileInit();

        const lines = data.trim().split('\n');
        const updatedLines = lines.filter((clip) => (options.days && new Date(JSON.parse(clip).timestamp) >= getCutOffDate(options.days)) || 
                                                    (!options.force && JSON.parse(clip).isPinned)
        );
        
        fs.writeFileSync(FILE_PATH, `${updatedLines.join('\n')}${updatedLines.length === 0 ? '' : '\n'}`, 'utf-8');

        console.log(chalk.bgGreen(`${options.force ? 'Clipboard entries cleared successfully' : 'Unpinned clipboard entries cleared successfully. Use --force flag to clear pinned entries too'}`));
    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the clear command:'), chalk.red(err.message));
    }
}