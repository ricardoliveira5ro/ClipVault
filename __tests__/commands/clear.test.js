import { jest } from '@jest/globals';

const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

const fsMock = {
    writeFileSync: jest.fn()
};
jest.unstable_mockModule('fs', () => ({
    default: fsMock
}));

jest.unstable_mockModule('chalk', () => ({
    default: {
        bgGreen: (msg) => msg,
        bgRed: (msg) => msg,
        red: (msg) => msg
    }
}));

const readFileInitMock = jest.fn();
const getCutOffDateMock = jest.fn();
const isNumericMock = jest.fn();

jest.unstable_mockModule('../../lib/utils.js', () => ({
    readFileInit: readFileInitMock,
    getCutOffDate: getCutOffDateMock,
    isNumeric: isNumericMock
}));

let clear;

beforeAll(async () => {
  ({ clear } = await import('../../commands/clear.js'));
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('clear command', () => {
    it('throws error on invalid days option', () => {
        isNumericMock.mockReturnValue(false);

        clear({ days: 'abc' });

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the clear command:'),
            expect.stringContaining('Invalid option')
        );
    });

    it('writes filtered data excluding pinned entries when force is not set', () => {
        isNumericMock.mockReturnValue(true);
        readFileInitMock.mockReturnValue([
            JSON.stringify({ timestamp: new Date().toISOString(), isPinned: false }),
            JSON.stringify({ timestamp: new Date().toISOString(), isPinned: true }),
        ].join('\n'));
        getCutOffDateMock.mockReturnValue(new Date(0));

        clear({});

        expect(fsMock.writeFileSync).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(String),
            'utf-8'
        );

        const writtenData = fsMock.writeFileSync.mock.calls[0][1];
        const lines = writtenData.trim().split('\n').map(line => JSON.parse(line));
        expect(lines.every(line => line.isPinned === true)).toBe(true);

        expect(consoleLogMock).toHaveBeenCalledWith('Unpinned clipboard entries cleared successfully. Use --force flag to clear pinned entries too');
    });

    it('clears all entries when force option is true', () => {
        isNumericMock.mockReturnValue(true);
        readFileInitMock.mockReturnValue([
            JSON.stringify({ timestamp: new Date().toISOString(), isPinned: true }),
            JSON.stringify({ timestamp: new Date().toISOString(), isPinned: true }),
        ].join('\n'));
        getCutOffDateMock.mockReturnValue(new Date(0));

        clear({ force: true });

        const writtenData = fsMock.writeFileSync.mock.calls[0][1];
        const lines = writtenData.trim().split('\n').filter(line => line.length > 0).map(line => JSON.parse(line));
        expect(lines.length).toBe(0);

        expect(consoleLogMock).toHaveBeenCalledWith(
        'Clipboard entries cleared successfully'
        );
    });

    it('clears entries older than cutoff date when days option is set', () => {
        isNumericMock.mockReturnValue(true);

        const recentDate = new Date();
        const oldDate = new Date(0);

        const oldEntry = JSON.stringify({ timestamp: oldDate.toISOString(), isPinned: false });
        const recentEntry = JSON.stringify({ timestamp: recentDate.toISOString(), isPinned: false });

        readFileInitMock.mockReturnValue([oldEntry, recentEntry].join('\n'));
        getCutOffDateMock.mockReturnValue(new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)));

        clear({ days: '7' });

        const writtenData = fsMock.writeFileSync.mock.calls[0][1];
        const lines = writtenData.trim().split('\n').map(line => JSON.parse(line));
        
        expect(lines.length).toBe(1);
        expect(lines[0]).toEqual(JSON.parse(recentEntry));
    });

    it('logs error if readFileInit throws', () => {
        isNumericMock.mockReturnValue(true);
        readFileInitMock.mockImplementation(() => { throw new Error('Test error') });

        clear({});

        expect(consoleErrorMock).toHaveBeenCalledWith(
        expect.stringContaining('An error occurred in the clear command:'),
        expect.stringContaining('Test error')
        );
    });
});