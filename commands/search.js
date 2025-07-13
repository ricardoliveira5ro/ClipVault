import chalk from "chalk";
import dayjs from "dayjs";

import { listing } from "../lib/tableListing.js";
import { isNumeric, readFileInit } from "../lib/utils.js";

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

        if (options.size) {
            if (!isNumeric(options.size) || parseInt(options.last) <= 0)
                throw new Error('Invalid option \'size\'. It must be a positive number');

            lines = lines.filter((clip) => JSON.parse(clip).size === parseInt(options.size));
        }

        listing(lines);

    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the search command:'), chalk.red(err.message));
    }
}