#!/usr/bin/env node

import { program } from "commander";

program
    .command('watch')
    .description('Start continuous clipboard monitoring')
    .action(() => { console.log("Starting..") })

program.parse();