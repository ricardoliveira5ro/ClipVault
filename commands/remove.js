import fs from "fs";
import chalk from "chalk";

import { readFileInit } from "../lib/utils.js";
import { FILE_PATH } from "../lib/constants.js";

export function remove(id, options) {
    try {
        const data = readFileInit();

        let wasRemoved = false;
        let wasPinned = false;
        
        const lines = data.trim().split('\n');
        const updatedLines = lines.filter((clip) => {
            const parsedClip = JSON.parse(clip);

            if (parsedClip.id === id) {
                if (parsedClip.isPinned && !options.force) {
                    wasPinned = true;
                    return true;
                }

                wasRemoved = true;
                return false;
            }

            return true;
        });
        
        fs.writeFileSync(FILE_PATH, updatedLines.join('\n'), 'utf-8');

        if (!wasRemoved && !wasPinned) {
            console.log(chalk.bgRed(`Could not found with id ${id}`));
            return;
        }


        console.log(wasPinned ? chalk.bgRed(`Cannot remove a pinned clipboard. Use flag --force`) : chalk.bgGreen(`Clipboard entry ${id} removed from clipboard successfully`));
    
    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the remove command:'), chalk.red(err.message));
    }
}