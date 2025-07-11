#!/usr/bin/env node

import { program } from "commander";

import { watch } from "../commands/watch.js";
import { list } from "../commands/list.js";
import { pin } from "../commands/pin.js";
import { unpin } from "../commands/unpin.js";
import { copy } from "../commands/copy.js";
import { remove } from "../commands/remove.js";

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

program.parse();