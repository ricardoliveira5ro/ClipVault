import chalk from "chalk";
import { isNumeric } from "../lib/utils.js";

export function list(options) {
    if (options.last && !isNumeric(options.last)) {
        console.log(chalk.bgRed('Invalid option \'last\'! Must be a number'))
        return;
    }
}