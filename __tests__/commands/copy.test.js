import { jest } from '@jest/globals';

const clipboardWriteMock = jest.fn();
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

jest.unstable_mockModule('clipboardy', () => ({
    default: {
        writeSync: clipboardWriteMock
    }
}));

jest.unstable_mockModule('chalk', () => ({
    default: {
        bgGreen: (msg) => msg,
        bgRed: (msg) => msg,
        red: (msg) => msg
    }
}));

const readFileInitMock = jest.fn();

jest.unstable_mockModule('../../lib/utils.js', () => ({
    readFileInit: readFileInitMock
}));

let copy;

beforeAll(async () => {
    ({ copy } = await import('../../commands/copy.js'));
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('copy command', () => {
    it('copies the correct clipboard entry when id exists', () => {
        const id = '123';
        const entry = JSON.stringify({ id, text: 'Hello clipboard' });
        readFileInitMock.mockReturnValue(`${entry}\n${JSON.stringify({ id: '456', text: 'Other text' })}`);

        copy(id);

        expect(clipboardWriteMock).toHaveBeenCalledWith('Hello clipboard');
        expect(consoleLogMock).toHaveBeenCalledWith(`Clipboard entry ${id} copied to clipboard successfully`);
    });

    it('logs error message if id not found', () => {
        const entry = JSON.stringify({ id: '123', text: 'Hello clipboard' });
        readFileInitMock.mockReturnValue(`${entry}\n${JSON.stringify({ id: '456', text: 'Other text' })}`);
        
        const wrongId = '999';
        copy(wrongId);

        expect(consoleLogMock).toHaveBeenCalledWith(`Could not found with id ${wrongId}`);
    });

    it('logs error if readFileInit throws', () => {
        const errMsg = 'read error';
        readFileInitMock.mockImplementation(() => { throw new Error(errMsg); });

        copy('123');

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the copy command:'),
            expect.stringContaining(errMsg)
        );
        expect(clipboardWriteMock).not.toHaveBeenCalled();
    });
});