import { jest } from "@jest/globals";

const fsMock = {
    existsSync: jest.fn(),
    writeFileSync: jest.fn(),
    readFileSync: jest.fn(),
    appendFileSync: jest.fn(),
};
jest.unstable_mockModule("fs", () => ({
    default: fsMock,
}));

const clipboardReadMock = jest.fn();
jest.unstable_mockModule("clipboardy", () => ({
    default: {
        readSync: clipboardReadMock,
    },
}));

jest.unstable_mockModule("chalk", () => ({
    default: {
        yellow: (msg) => msg,
        blue: (msg) => msg,
        grey: (msg) => msg,
        red: (msg) => msg,
        bgRed: (msg) => msg,
    },
}));

jest.unstable_mockModule("figlet", () => ({
    default: {
        textSync: (msg) => msg,
    },
}));

const exitMock = jest.fn();
const processOnMock = jest.fn();

Object.defineProperty(global.process, "exit", {
    value: exitMock,
    writable: true,
});
Object.defineProperty(global.process, "on", {
    value: processOnMock,
    writable: true,
});

let watch;

beforeAll(async () => {
    ({ watch } = await import("../../commands/watch.js"));
});

describe("watch command", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("writes clipboard changes to file when text changes", () => {
        fsMock.existsSync.mockReturnValue(true);
        fsMock.readFileSync.mockReturnValue("");
        clipboardReadMock.mockReturnValueOnce("Copied Text");

        watch();

        jest.advanceTimersByTime(200);

        expect(fsMock.appendFileSync).toHaveBeenCalledTimes(1);
        expect(fsMock.appendFileSync.mock.calls[0][1]).toContain("Copied Text");
    });

    it("does not write if clipboard didn't change", () => {
        fsMock.existsSync.mockReturnValue(true);
        fsMock.readFileSync.mockReturnValue("");
        clipboardReadMock
        .mockReturnValueOnce("Same text")
        .mockReturnValueOnce("Same text");

        watch();

        jest.advanceTimersByTime(200);
        jest.advanceTimersByTime(200);

        expect(fsMock.appendFileSync).toHaveBeenCalledTimes(1);
    });

    it("reads last clipboard entry from file", () => {
        const lastClipboard = JSON.stringify({ text: "Last saved" });

        fsMock.existsSync.mockReturnValue(true);
        fsMock.readFileSync.mockReturnValue(lastClipboard);

        clipboardReadMock.mockReturnValueOnce("Something new");

        watch();

        jest.advanceTimersByTime(200);

        expect(fsMock.appendFileSync).toHaveBeenCalledTimes(1);
    });

    it("handles missing file", () => {
        fsMock.existsSync.mockReturnValue(false);
        fsMock.readFileSync.mockReturnValue("");
        clipboardReadMock.mockReturnValueOnce("First clipboard");

        watch();

        jest.advanceTimersByTime(200);

        expect(fsMock.writeFileSync).toHaveBeenCalled();
        expect(fsMock.appendFileSync).toHaveBeenCalled();
    });

    it("handles SIGINT (Ctrl+C) and exits", () => {
        fsMock.existsSync.mockReturnValue(true);
        fsMock.readFileSync.mockReturnValue("");

        watch();

        expect(processOnMock).toHaveBeenCalledWith("SIGINT", expect.any(Function));

        const handler = processOnMock.mock.calls[0][1];
        handler();

        expect(exitMock).toHaveBeenCalledWith(0);
    });

    it("logs error when an exception is thrown", () => {
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

        fsMock.existsSync.mockImplementation(() => { throw new Error("Test error"); });

        watch();

        expect(consoleErrorMock).toHaveBeenCalledWith(
            expect.stringContaining("An error occurred in the watch command:"),
            expect.stringContaining("Test error")
        );

        consoleErrorMock.mockRestore();
    });
});
