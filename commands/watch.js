import fs from 'fs';
import path from 'path';
import os from 'os';
import clipboard from 'clipboardy';

// TODO: Parse JSON file
const filePath = path.join(os.homedir(), 'Documents', 'clipvault.txt');

export function watch() {
    let lastClipboardText = '';

    try {
        if (!fs.existsSync(filePath))
            fs.writeFileSync(filePath, '', 'utf-8');

        const data = fs.readFileSync(filePath, 'utf-8');

        if (data)
            lastClipboardText = data.split(/\r?\n/)[0];

        const interval = setInterval(() => {
            const text = clipboard.readSync();
            
            if (text && text != '' && text != lastClipboardText) {
                // TODO:
                // Append new text to file
                // [ID | TEXT | SIZE | TIMESTAMP | ISPINNED]

                // Update lastClipboardText
            }
        }, 200);

        process.on('SIGINT', () => {
            clearInterval(interval);
            process.exit(0);
        });
    
    } catch (err) {
        console.error('File error:', err.message);
    }
    
}