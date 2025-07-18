import { jest } from '@jest/globals';

const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
const listingMock = jest.fn();

jest.unstable_mockModule('chalk', () => ({
    default: {
        bgRed: (msg) => msg,
        red: (msg) => msg,
    }
}));

jest.unstable_mockModule('dayjs', () => {
    const dayjs = (date, format, strict) => {
        const instance = {
            format: () => (new Date(date)).toISOString().slice(0, 10),
            isValid: () => !strict || /^\d{4}-\d{2}-\d{2}$/.test(date)
        };
        return instance;
    };
    dayjs.default = dayjs;
    return dayjs;
});

const readFileInitMock = jest.fn();
const isNumericMock = jest.fn();

jest.unstable_mockModule('../../lib/utils.js', () => ({
    readFileInit: readFileInitMock,
    isNumeric: isNumericMock
}));

jest.unstable_mockModule('../../lib/tableListing.js', () => ({
    listing: listingMock
}));

let search;

beforeAll(async () => {
    ({ search } = await import('../../commands/search.js'));
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('search command', () => {
    const mockData = [
        { id: '1', text: 'Hello world', timestamp: new Date('2024-12-01').toISOString(), size: 100, isPinned: true },
        { id: '2', text: 'Another line', timestamp: new Date('2024-12-02').toISOString(), size: 50, isPinned: false }
    ];

    beforeEach(() => {
        readFileInitMock.mockReturnValue(mockData.map(JSON.stringify).join('\n'));
    });

    it('filters by query', () => {
        search({ query: 'hello' });
        expect(listingMock).toHaveBeenCalledWith([JSON.stringify(mockData[0])]);
    });

    it('filters by exact date', () => {
        search({ date: '2024-12-02' });
        expect(listingMock).toHaveBeenCalledWith([JSON.stringify(mockData[1])]);
    });

    it('throws on invalid date', () => {
        search({ date: '12-01-2024' });
        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the search command:'),
            expect.stringContaining("Invalid 'date' argument")
        );
    });

    it('filters by maxSize', () => {
        isNumericMock.mockReturnValue(true);
        search({ maxSize: 60 });
        expect(listingMock).toHaveBeenCalledWith([JSON.stringify(mockData[1])]);
    });

    it('throws on invalid maxSize', () => {
        isNumericMock.mockReturnValue(false);
        search({ maxSize: 'invalid' });
        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the search command:'),
            expect.stringContaining('Invalid option \'max-size\'')
        );
    });

    it('filters by minSize', () => {
        isNumericMock.mockReturnValue(true);
        search({ minSize: 80 });
        expect(listingMock).toHaveBeenCalledWith([JSON.stringify(mockData[0])]);
    });

    it('throws on invalid minSize', () => {
        isNumericMock.mockReturnValue(false);
        search({ minSize: 'x' });
        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the search command:'),
            expect.stringContaining('Invalid option \'min-size\'')
        );
    });

    it('filters by pinned', () => {
        search({ pinned: true });
        expect(listingMock).toHaveBeenCalledWith([JSON.stringify(mockData[0])]);
    });

    it('lists all without filters', () => {
        search({});
        expect(listingMock).toHaveBeenCalledWith(mockData.map(JSON.stringify));
    });

    it('logs error if readFileInit throws', () => {
        readFileInitMock.mockImplementation(() => { throw new Error('test error'); });

        search({});
        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the search command:'),
            expect.stringContaining('test error')
        );
    });
});