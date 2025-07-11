import clipboard from 'clipboardy';
import chalk from "chalk";
import fs from "fs";

import { FILE_PATH } from '../lib/constants.js';

export function copy(id) {
    try {
        if (!fs.existsSync(FILE_PATH))
            fs.writeFileSync(FILE_PATH, '', 'utf-8');
    
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
    
        if (!data) {
            throw new Error('No data available');
        }

        const lines = data.trim().split('\n');
        const result = lines.find((clip) => JSON.parse(clip).id === id);

        clipboard.writeSync(JSON.parse(result).text);

        console.log(result ? chalk.bgGreen(`Clipboard entry ${id} copied to clipboard successfully`) : chalk.bgRed(`Could not found with id ${id}`));
    
    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the copy command:'), chalk.red(err.message));
    }
}