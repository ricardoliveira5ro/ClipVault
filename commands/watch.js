import fs from 'fs';
import crypto from 'crypto';
import clipboard from 'clipboardy';
import chalk from 'chalk';
import figlet from 'figlet';

import { FILE_PATH } from '../lib/constants.js';

export function watch() {
    let lastClipboardText = '';

    try {
        console.log(chalk.yellow(figlet.textSync('ClipVault', { horizontalLayout: "full" })));
        console.log(chalk.blue('\n\nWatching for clipboard changes...'))

        if (!fs.existsSync(FILE_PATH))
            fs.writeFileSync(FILE_PATH, '', 'utf-8');

        const data = fs.readFileSync(FILE_PATH, 'utf-8');

        if (data) {
            const lines = data.trim().split('\n');
            const lastLine = lines[lines.length - 1];

            lastClipboardText = JSON.parse(lastLine).text || '';
        }

        const interval = setInterval(() => {
            const text = clipboard.readSync();
            
            if (text && text != '' && text != lastClipboardText) {
                const newClipboard = {
                    id: crypto.randomBytes(4).toString('hex'),
                    text: text,
                    size: Buffer.byteLength(text, 'utf-8'),
                    timestamp: new Date().toISOString(),
                    isPinned: false
                };

                fs.appendFileSync(FILE_PATH, JSON.stringify(newClipboard) + '\n', 'utf-8');
                lastClipboardText = text;

                console.log(chalk.grey('Copied: ' + text));
            }
        }, 200);

        process.on('SIGINT', () => {
            console.log(chalk.bgRed('Stopped watching clipboard'))
            clearInterval(interval);
            process.exit(0);
        });
    
    } catch (err) {
        console.error(chalk.bgRed('An error occurred in the watch command:'), chalk.red(err.message));
    }

}