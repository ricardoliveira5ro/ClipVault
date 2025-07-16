import { jest } from '@jest/globals';

const mockReadFileInit = jest.fn();
const mockListing = jest.fn();

jest.unstable_mockModule('../../lib/utils.js', () => ({
    readFileInit: mockReadFileInit,
    isNumeric: (str) => !isNaN(str) && !isNaN(parseFloat(str)),
}));

jest.unstable_mockModule('../../lib/tableListing.js', () => ({
    listing: mockListing,
}));

let list;

beforeAll(async () => {
    ({ list } = await import('../../commands/list.js'));
});

describe('list command', () => {
    let consoleOutput = [];
    const originalConsoleLog = console.log;

    beforeEach(() => {
        consoleOutput = [];
        console.log = (msg) => consoleOutput.push(msg);

        mockReadFileInit.mockReset();
        mockListing.mockReset();
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    it('list all clipboard entries when no last option', () => {
        const mockData = [
            { id: '1', text: 'First', size: 100, timestamp: new Date().toISOString(), isPinned: false },
            { id: '2', text: 'Second', size: 200, timestamp: new Date().toISOString(), isPinned: true },
        ];

        mockReadFileInit.mockReturnValue(mockData.map(JSON.stringify).join('\n'));

        list({});

        expect(mockListing).toHaveBeenCalledTimes(1);

        const [linesToDisplay, linesLeft] = mockListing.mock.calls[0];

        const parsedLinesToDisplay = linesToDisplay.map(JSON.parse);
        const parsedLinesLeft = linesLeft.map(JSON.parse);

        expect(parsedLinesToDisplay).toEqual(mockData.reverse());
        expect(parsedLinesLeft).toEqual([]);
    });

    it('list only last N clipboard entries when last option specified', () => {
        const mockData = [
            { id: '1', text: 'First', size: 100, timestamp: new Date().toISOString(), isPinned: false },
            { id: '2', text: 'Second', size: 200, timestamp: new Date().toISOString(), isPinned: true },
            { id: '3', text: 'Third', size: 300, timestamp: new Date().toISOString(), isPinned: false },
        ];

        mockReadFileInit.mockReturnValue(mockData.map(JSON.stringify).join('\n'));

        list({ last: '2' });

        expect(mockListing).toHaveBeenCalledTimes(1);

        const [linesToDisplay, linesLeft] = mockListing.mock.calls[0];

        const parsedLinesToDisplay = linesToDisplay.map(JSON.parse);
        const parsedLinesLeft = linesLeft.map(JSON.parse);

        const expectedLinesToDisplay = mockData.slice().reverse().slice(0, 2);
        const expectedLinesLeft = mockData.slice().reverse().slice(2);

        expect(parsedLinesToDisplay).toEqual(expectedLinesToDisplay);
        expect(parsedLinesLeft).toEqual(expectedLinesLeft);
    });

    it('throws an error when option last is not valid', () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        list({ last: 'aa' });

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the list command:'),
            expect.stringContaining('Invalid option')
        );

        consoleErrorMock.mockRestore();
    });
});