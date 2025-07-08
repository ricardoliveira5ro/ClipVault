#!/usr/bin/env node

import { program } from "commander";

import { watch } from "../commands/watch.js";

program
    .command('watch')
    .description('Start continuous clipboard monitoring')
    .action(watch)

program.parse();