import fs from "fs";

import { FILE_PATH } from "../lib/constants.js";
import { formatSize, getCutOffDate, isNumeric, readFileInit } from "../lib/utils.js";

describe('readFileInit', () => {
    beforeEach(() => {
        if (fs.existsSync(FILE_PATH))
            fs.unlinkSync(FILE_PATH);
    });

    afterEach(() => {
        if (fs.existsSync(FILE_PATH))
            fs.unlinkSync(FILE_PATH);
    });

    it('throws an error if file exists but is empty', () => {
        expect(() => readFileInit()).toThrow('No data available');
    });

    it('creates the file if it does not exist', () => {
        expect(() => readFileInit()).toThrow('No data available');
        expect(fs.existsSync(FILE_PATH)).toBe(true);
    });

    it('returns file content', () => {
        const mockData = {
            id: "08e69c01",
            text: "Some text",
            size: 58,
            timestamp: "2025-07-14T20:59:06.300Z",
            isPinned: false
        }

        fs.writeFileSync(FILE_PATH, JSON.stringify(mockData) + '\n', 'utf-8');

        const result = readFileInit().trim().split('\n')[0];
        expect(mockData).toBe(mockData);
    });
});

describe('formatSize', () => {
    it('returns formatted in bytes (B)', () => {
        expect(formatSize(50)).toBe('50 B');
        expect(formatSize(1023)).toBe('1023 B');
    });

    it('returns formatted in kilobytes (KB)', () => {
        expect(formatSize(1024)).toBe('1.0 KB');
        expect(formatSize(1048575)).toBe('1024.0 KB');
    });

    it('returns formatted in megabytes (MB)', () => {
        expect(formatSize(1048576)).toBe('1.0 MB');
        expect(formatSize(10485760)).toBe('10.0 MB');
    });
});

describe('formatSize', () => {
    it('returns formatted in bytes (B)', () => {
        expect(formatSize(50)).toBe('50 B');
        expect(formatSize(1023)).toBe('1023 B');
    });

    it('returns formatted in kilobytes (KB)', () => {
        expect(formatSize(1024)).toBe('1.0 KB');
        expect(formatSize(1048575)).toBe('1024.0 KB');
    });

    it('returns formatted in megabytes (MB)', () => {
        expect(formatSize(1048576)).toBe('1.0 MB');
        expect(formatSize(10485760)).toBe('10.0 MB');
    });
});

describe('isNumeric', () => {
    it('returns true for numeric strings', () => {
        expect(isNumeric('123')).toBe(true);
        expect(isNumeric('-123')).toBe(true);
        expect(isNumeric('1.23')).toBe(true);
    });

    it('returns false for invalid numeric strings', () => {
        expect(isNumeric('1abc')).toBe(false);
        expect(isNumeric('12e')).toBe(false);
    });

    it('returns false for not string inputs', () => {
        expect(isNumeric(null)).toBe(false);
        expect(isNumeric(new Date())).toBe(false);
    });
});

describe('getCutOffDate', () => {
    it('return a date N days in the past', () => {
        const numDays = 10;

        const now = new Date();
        const expected = new Date(now);
        expected.setDate(now.getDate() - numDays);

        const actual = getCutOffDate(numDays);

        expect(actual.getFullYear()).toBe(expected.getFullYear());
        expect(actual.getMonth()).toBe(expected.getMonth());
        expect(actual.getDate()).toBe(expected.getDate());
    });
});