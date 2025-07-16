import chalk from 'chalk';
import { listing } from '../lib/tableListing';

describe('listing', () => {
    const originalConsoleLog = console.log;
    let consoleOutput = [];

    beforeEach(() => {
        consoleOutput = [];
        console.log = (output) => consoleOutput.push(output);
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    const mockClip = JSON.stringify({
        id: 'abc123',
        text: 'Clipboard text',
        size: 100,
        timestamp: new Date().toISOString(),
        isPinned: false
    });

    const pinnedClip = JSON.stringify({
        id: 'abc123',
        text: 'Pinned text',
        size: 100,
        timestamp: new Date().toISOString(),
        isPinned: true
    });

    it('logs table with only linesToDisplay', () => {
        listing([mockClip], null);

        expect(consoleOutput.length).toBe(1);
        expect(consoleOutput[0]).toContain('abc123');
        expect(consoleOutput[0]).toContain('Clipboard text');
    });

    it('logs pinned section only if pinned clips exist in linesLeft', () => {
        listing([mockClip], [pinnedClip]);

        expect(consoleOutput.length).toBe(1);
        expect(consoleOutput[0]).toContain(chalk.bgBlue.bold('  PINNED ITEMS  '));
        expect(consoleOutput[0]).toContain('Pinned text');
    });

    it('does not add pinned section if no pinned clips exist in linesLeft', () => {
        listing([mockClip], [mockClip]);

        expect(consoleOutput.length).toBe(1);
        expect(consoleOutput[0]).not.toContain('PINNED ITEMS');
    });

    it('renders ✅ for pinned and ❌ for unpinned clips', () => {
        listing([mockClip, pinnedClip], [pinnedClip]);

        expect(consoleOutput.length).toBe(1);
        expect(consoleOutput[0]).toContain('✅');
        expect(consoleOutput[0]).toContain('❌');
    });
});