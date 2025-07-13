import { isNumeric } from "../lib/utils.js";

test('returns true for numeric strings', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('-123')).toBe(true);
    expect(isNumeric('1.23')).toBe(true);
    
    expect(isNumeric('1abc')).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(new Date())).toBe(false);
});