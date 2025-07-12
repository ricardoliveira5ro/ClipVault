import chalk from "chalk";
import fs from "fs";

import { readFileInit } from "../lib/utils.js";
import { FILE_PATH } from "../lib/constants.js";

export function clear(options) {
    try {
        const data = readFileInit();

        const lines = data.trim().split('\n');
        const updatedLines = lines.filter((clip) => JSON.parse(clip).isPinned);

        fs.writeFileSync(FILE_PATH, updatedLines.join('\n'), 'utf-8');

        console.log(chalk.bgGreen(`All clipboard entries cleared successfully`));
        
    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the clear command:'), chalk.red(err.message));
    }
}