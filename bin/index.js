#!/usr/bin/env node

import { program } from "commander";

import { watch } from "../commands/watch.js";
import { list } from "../commands/list.js";

program
    .command('watch')
    .description('Start continuous clipboard monitoring')
    .action(watch)

program
    .command('list')
    .description('List saved clipboard entries with optional filters')
    .option('--last <number>', 'Show only the last <n> clipboard entries')
    .action((options) => list(options))

program.parse();