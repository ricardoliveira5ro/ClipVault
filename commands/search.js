import chalk from "chalk";
import dayjs from "dayjs";

import { listing } from "../lib/tableListing.js";
import { readFileInit } from "../lib/utils.js";

export function search(options) {
    try {
        const data = readFileInit();

        let lines = data.trim().split('\n');

        if (options.query)
            lines = lines.filter((clip) => JSON.parse(clip).text.toLowerCase().includes(options.query.toLowerCase()));

        if (options.date) {
            if (!dayjs(options.date, 'YYYY-MM-DD', true).isValid()) 
                throw new Error("Invalid 'date' argument. Please use format YYYY-MM-DD");

            lines = lines.filter((clip) => dayjs(JSON.parse(clip).timestamp).format('YYYY-MM-DD') === options.date);
        }

        listing(lines);

    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the search command:'), chalk.red(err.message));
    }
}