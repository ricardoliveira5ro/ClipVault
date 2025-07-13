#!/usr/bin/env node

import { program } from "commander";

import { watch } from "../commands/watch.js";
import { list } from "../commands/list.js";
import { pin } from "../commands/pin.js";
import { unpin } from "../commands/unpin.js";
import { copy } from "../commands/copy.js";
import { remove } from "../commands/remove.js";
import { clear } from "../commands/clear.js";
import { search } from "../commands/search.js";

program
    .command('watch')
    .description('Start continuous clipboard monitoring')
    .action(watch)

program
    .command('list')
    .description('List saved clipboard entries with optional filters')
    .option('--last <number>', 'Show only the last <n> clipboard entries')
    .action((options) => list(options))

program
    .command('pin')
    .description('Pin a clipboard entry by its ID')
    .argument('<id>', 'Clipboard entry identifier')
    .action((id) => pin(id))

program
    .command('unpin')
    .description('Unpin a clipboard entry by its ID')
    .argument('<id>', 'Clipboard entry identifier')
    .action((id) => unpin(id))

program
    .command('copy')
    .description('Copy a saved clipboard entry back to the system clipboard')
    .argument('<id>', 'Clipboard entry identifier')
    .action((id) => copy(id))

program
    .command('remove')
    .description('Remove a clipboard entry by its ID')
    .argument('<id>', 'Clipboard entry identifier')
    .option('--force', 'Force to remove pinned clips too')
    .action((id, options) => remove(id, options))

program
    .command('clear')
    .description('Clear clipboard entirely')
    .option('--force', 'Force to clear pinned clips too')
    .option('--days <number>', 'Keep last <n> days history')
    .action((options) => clear(options))

program
    .command('search')
    .description('Search through the clipboard entries')
    .option('--query <text>', 'Text expression to match')
    .option('--date <date>', 'Date (YYYY-MM-DD) to match entries copied on that day')
    .option('--min-size <number>', 'Minimum clipboard entry size')
    .option('--max-size <number>', 'Maximum clipboard entry size')
    .option('--pinned', 'Only pinned clipboard entries')
    .action((options) => search(options))

program.parse();