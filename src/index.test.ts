import { add } from '../src/index';

describe('Basic test', () => {
    it('should add numbers', () => {
        expect(add(1, 2)).toBe(3);
    })
})