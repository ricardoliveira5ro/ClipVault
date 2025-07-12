import chalk from "chalk";

import { listing } from "../lib/tableListing.js";
import { readFileInit } from "../lib/utils.js";

export function search(options) {
    try {
        const data = readFileInit();

        const lines = data.trim().split('\n');
        const matchedLines = lines.filter((clip) => JSON.parse(clip).text.toLowerCase().includes(options.query.toLowerCase()));

        listing(matchedLines);

    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the search command:'), chalk.red(err.message));
    }
}