import chalk from "chalk";

import { isNumeric, readFileInit } from "../lib/utils.js";
import { listing } from "../lib/tableListing.js";

export function list(options) {
    try {
        if (options.last && (!isNumeric(options.last) || parseInt(options.last) <= 0)) {
            throw new Error('Invalid option \'last\'. It must be a positive number');
        }

        const data = readFileInit();

        const numOfRecordsToDisplay = options.last ? parseInt(options.last) : Number.MAX_SAFE_INTEGER;

        const lines = data.trim().split('\n').reverse();
        const linesToDisplay = (lines.length > numOfRecordsToDisplay) ? 
                                    lines.slice(0, numOfRecordsToDisplay) : lines;

        const linesLeft = (lines.length > numOfRecordsToDisplay) ?
                                lines.slice(numOfRecordsToDisplay, lines.length) : [];

        listing(linesToDisplay, linesLeft);

    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the list command:'), chalk.red(err.message));
    }
}