import fs from "fs";

import { FILE_PATH } from "../lib/constants.js";
import { updateRecord } from "../lib/updateRecord.js";

describe('updateRecord', () => {
    beforeEach(() => {
        const mockClip = JSON.stringify({
            id: 'abc123',
            text: 'Clipboard text',
            size: 100,
            timestamp: new Date().toISOString(),
            isPinned: false
        });

        if (!fs.existsSync(FILE_PATH))
            fs.writeFileSync(FILE_PATH, mockClip + '\n', 'utf-8');
    });

    afterEach(() => {
        if (fs.existsSync(FILE_PATH))
            fs.unlinkSync(FILE_PATH);
    });

    it('finds and update (pin) record', () => {
        const result = updateRecord('abc123', (clip) => {
            clip.isPinned = true;
            return clip;
        });

        expect(result).toBe(true);
    });

    it('finds and update (unpin) record', () => {
        const result = updateRecord('abc123', (clip) => {
            clip.isPinned = false;
            return clip;
        });

        expect(result).toBe(true);
    });

    it('cannot find record', () => {
        const result = updateRecord('aa11', (clip) => {
            clip.isPinned = true;
            return clip;
        });

        expect(result).toBe(false);
    });
});