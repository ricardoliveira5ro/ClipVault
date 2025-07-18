import { jest } from '@jest/globals';

const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

const updateRecordMock = jest.fn();

jest.unstable_mockModule('../../lib/updateRecord.js', () => ({
    updateRecord: updateRecordMock
}));

jest.unstable_mockModule('chalk', () => ({
    default: {
        bgGreen: (msg) => msg,
        bgRed: (msg) => msg,
        red: (msg) => msg
    }
}));

let pin;

beforeAll(async () => {
    ({ pin } = await import('../../commands/pin.js'));
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('pin command', () => {
    it('pins clipboard entry successfully', () => {
        updateRecordMock.mockImplementation((id, cb) => cb({ id, isPinned: false }));

        pin('123');

        expect(updateRecordMock).toHaveBeenCalledWith('123', expect.any(Function));
        expect(consoleLogMock).toHaveBeenCalledWith('Clipboard entry 123 pinned successfully');
    });

    it('logs error if id not found', () => {
        updateRecordMock.mockReturnValue(null);

        pin('999');

        expect(updateRecordMock).toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalledWith('Could not found with id 999');
    });

    it('logs error if updateRecord throws', () => {
        updateRecordMock.mockImplementation(() => { throw new Error('Unexpected error'); });

        pin('456');

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the pin command:'),
            expect.stringContaining('Unexpected error')
        );
    });
});