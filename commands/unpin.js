import chalk from "chalk";

import { updateRecord } from "../lib/updateRecord.js";

export function unpin(id) {
    try {
        const result = updateRecord(id, (clip) => {
            clip.isPinned = false;
            return clip;
        });

        console.log(result ? chalk.bgGreen(`Clipboard entry ${id} unpinned successfully`) : chalk.bgRed(`Could not found with id ${id}`));

    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the unpin command:'), chalk.red(err.message));
    }
}