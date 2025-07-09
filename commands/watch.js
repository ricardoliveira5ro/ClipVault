import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import clipboard from 'clipboardy';
import chalk from 'chalk';
import figlet from 'figlet';

import { formatSize } from '../utils/functions.js';

const filePath = path.join(os.homedir(), 'Documents', 'clipvault.json');

export function watch() {
    let lastClipboardText = '';

    try {
        console.log(chalk.yellow(figlet.textSync('ClipVault', { horizontalLayout: "full" })));
        console.log(chalk.blue('\n\nWatching for clipboard changes...'))

        if (!fs.existsSync(filePath))
            fs.writeFileSync(filePath, '', 'utf-8');

        const data = fs.readFileSync(filePath, 'utf-8');

        if (data) {
            const lines = data.trim().split('\n');
            const lastLine = lines[lines.length - 1];

            lastClipboardText = JSON.parse(lastLine).text || '';
        }

        const interval = setInterval(() => {
            const text = clipboard.readSync();
            
            if (text && text != '' && text != lastClipboardText) {
                const newClipboard = {
                    id: crypto.randomBytes(6).toString('hex'),
                    text: text,
                    size: formatSize(Buffer.byteLength(text, 'utf-8')),
                    timestamp: new Date().toISOString(),
                    isPinned: false
                };

                fs.appendFileSync(filePath, JSON.stringify(newClipboard) + '\n', 'utf-8');
                lastClipboardText = text;
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