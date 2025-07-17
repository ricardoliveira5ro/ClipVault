import { jest } from '@jest/globals';

const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

const updateRecordMock = jest.fn();

jest.unstable_mockModule('../../lib/updateRecord.js', () => ({
    updateRecord: updateRecordMock,
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
    it('pins the clipboard entry successfully', () => {
        const id = '123';
        const originalClip = { id, text: 'Hello', isPinned: false };

        updateRecordMock.mockImplementation((id, updaterFn) => {
            const updated = updaterFn({ ...originalClip });
            return updated;
        });

        pin(id);

        expect(updateRecordMock).toHaveBeenCalledWith(id, expect.any(Function));
        expect(consoleLogMock).toHaveBeenCalledWith(`Clipboard entry ${id} pinned successfully`);
    });

    it('logs error message if id not found', () => {
        const id = '999';
        updateRecordMock.mockReturnValue(undefined);

        pin(id);

        expect(consoleLogMock).toHaveBeenCalledWith(`Could not found with id ${id}`);
    });

    it('logs error if updateRecord throws', () => {
        updateRecordMock.mockImplementation(() => { throw new Error('Test error'); });

        pin('123');

        expect(consoleErrorMock).toHaveBeenCalledWith(
        expect.stringContaining('An error occurred in the pin command:'),
        expect.stringContaining('Test error')
        );
    });
});