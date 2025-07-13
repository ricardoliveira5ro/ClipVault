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
    .description('Start monitoring the clipboard for new entries')
    .action(watch)

program
    .command('list')
    .description('Display saved clipboard entries')
    .option('--last <number>', 'Show only the most recent <n> entries')
    .action((options) => list(options))

program
    .command('pin')
    .description('Mark a clipboard entry as pinned by its ID')
    .argument('<id>', 'ID of the clipboard entry to pin')
    .action((id) => pin(id))

program
    .command('unpin')
    .description('Remove the pinned status from an entry by its ID')
    .argument('<id>', 'ID of the clipboard entry to unpin')
    .action((id) => unpin(id))

program
    .command('copy')
    .description('Copy a saved clipboard entry back to the system clipboard')
    .argument('<id>', 'ID of the clipboard entry to copy')
    .action((id) => copy(id))

program
    .command('remove')
    .description('Delete a clipboard entry by its ID')
    .argument('<id>', 'ID of the clipboard entry to remove')
    .option('--force', 'Allow deletion of pinned entries')
    .action((id, options) => remove(id, options))

program
    .command('clear')
    .description('Clear clipboard history')
    .option('--force', 'Also delete pinned entries')
    .option('--days <number>', 'Keep only the last <n> days of entries')
    .action((options) => clear(options))

program
    .command('search')
    .description('Search saved clipboard entries with filters')
    .option('--query <text>', 'Text to search for')
    .option('--date <date>', 'Match entries by date (YYYY-MM-DD)')
    .option('--min-size <number>', 'Minimum size in bytes')
    .option('--max-size <number>', 'Maximum size in bytes')
    .option('--pinned', 'Only show pinned entries')
    .action((options) => search(options))

program.parse();