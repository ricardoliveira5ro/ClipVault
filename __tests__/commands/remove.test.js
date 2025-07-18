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
jest.unstable_mockModule('../../lib/utils.js', () => ({
    readFileInit: readFileInitMock
}));

let remove;

beforeAll(async () => {
    ({ remove } = await import('../../commands/remove.js'));
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('remove command', () => {
    it('removes an unpinned clipboard entry', () => {
        const id = '123';
        const entry = JSON.stringify({ id, text: 'hello', isPinned: false });
        readFileInitMock.mockReturnValue(entry);

        remove(id, {});

        expect(fsMock.writeFileSync).toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalledWith(`Clipboard entry ${id} removed from clipboard successfully`);
    });

    it('does not remove pinned entry without force flag', () => {
        const id = '123';
        const entry = JSON.stringify({ id, text: 'hi', isPinned: true });
        readFileInitMock.mockReturnValue(entry);

        remove(id, { force: false });

        expect(fsMock.writeFileSync).toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalledWith('Cannot remove a pinned clipboard. Use flag --force');
    });

    it('removes pinned entry with force flag', () => {
        const id = '123';
        const entry = JSON.stringify({ id, text: 'hi', isPinned: true });
        readFileInitMock.mockReturnValue(entry);

        remove(id, { force: true });

        expect(fsMock.writeFileSync).toHaveBeenCalled();
        expect(consoleLogMock).toHaveBeenCalledWith(`Clipboard entry ${id} removed from clipboard successfully`);
    });

    it('logs message if entry is not found', () => {
        const id = '123';
        const otherEntry = JSON.stringify({ id: '999', text: 'not it', isPinned: false });
        readFileInitMock.mockReturnValue(otherEntry);

        remove(id, {});

        expect(consoleLogMock).toHaveBeenCalledWith(`Could not found with id ${id}`);
    });

    it('logs error if readFileInit throws', () => {
        readFileInitMock.mockImplementation(() => { throw new Error('Read fail'); });

        remove('123', {});

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining('An error occurred in the remove command:'),
            expect.stringContaining('Read fail')
        );
    });
});