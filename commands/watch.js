import fs from 'fs';
import path from 'path';
import os from 'os';

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
            
        }, 200);

        process.on('SIGINT', () => {
            clearInterval(interval);
            process.exit(0);
        });
    
    } catch (err) {
        console.error('File error:', err.message);
    }
    
}