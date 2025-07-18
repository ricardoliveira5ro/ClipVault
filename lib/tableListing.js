import Table from 'cli-table3'
import chalk from "chalk";

import { formatSize } from './utils.js';

export function listing(linesToDisplay, linesLeft) {
    const table = new Table({
        head: ['ID', 'Text', 'Size', 'Date', 'Pinned'],
        colWidths: [10, 80, 10, 25, 10],
        colAligns: ['left', 'left', 'center', 'left', 'center'],
        wordWrap: true
    })

    linesToDisplay.forEach(clip => {
        const parsedClip = JSON.parse(clip);
        
        table.push([
            parsedClip.id,
            parsedClip.text.replace(/\s+/g, ' ').trim(),
            formatSize(parsedClip.size),
            new Date(parsedClip.timestamp).toLocaleString(),
            parsedClip.isPinned ? '✅' : '❌'
        ])
    });

    if (!linesLeft) {
        console.log(table.toString());
        return;
    }

    if (linesLeft.some(line => JSON.parse(line).isPinned)) {
        table.push([
            {
            colSpan: 5,
            content: chalk.bgBlue.bold('  PINNED ITEMS  '),
            hAlign: 'center'
            }
        ]);
    }

    linesLeft.forEach(clip => {
        const parsedClip = JSON.parse(clip);

        if (parsedClip.isPinned) {
            table.push([
                parsedClip.id,
                parsedClip.text.replace(/\s+/g, ' ').trim(),
                formatSize(parsedClip.size),
                new Date(parsedClip.timestamp).toLocaleString(),
                '✅'
            ])
        }
    })

    console.log(table.toString());
}