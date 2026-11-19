import {describe,expect,it} from 'vitest';
import {GATE_EXAM_DATE} from '../src/shared/config/exam';
describe('exam configuration',()=>{
 it('uses midnight IST on 6 February 2027',()=>expect(GATE_EXAM_DATE.toISOString()).toBe('2027-02-05T18:30:00.000Z'));
 it('exports a valid date',()=>expect(Number.isNaN(GATE_EXAM_DATE.getTime())).toBe(false));
});
