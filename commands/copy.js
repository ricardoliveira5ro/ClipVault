import clipboard from 'clipboardy';
import chalk from "chalk";

import { readFileInit } from '../lib/utils.js';

export function copy(id) {
    try {
        const data = readFileInit();

        const lines = data.trim().split('\n');
        const result = lines.find((clip) => JSON.parse(clip).id === id);

        if (!result) {
            console.log(chalk.bgRed(`Could not found with id ${id}`));
            return;
        }

        clipboard.writeSync(JSON.parse(result).text);
        console.log(chalk.bgGreen(`Clipboard entry ${id} copied to clipboard successfully`));
    
    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the copy command:'), chalk.red(err.message));
    }
}