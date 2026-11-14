import {describe,expect,it} from 'vitest';
import {buildTopicStats,calculateStudyStreak,formatStudyDuration} from '../../src/features/learning/statisticsLogic';
describe('statistics unit logic',()=>{
 it('aggregates repeated attempts and unique questions by subject and topic',()=>{
  const rows=buildTopicStats([{id:'q1',subject:'Algorithms',topic:'Searching'},{id:'q2',subject:'Algorithms',topic:'Searching'}],[{qid:'q1',correct:true},{qid:'q1',correct:false},{qid:'q2',correct:false},{qid:'missing',correct:false}]);
  expect(rows).toMatchObject([{subject:'Algorithms',topic:'Searching',correct:1,wrong:2,uniqueQuestions:2,total:3}]);
 });
 it('formats study durations at seconds, minutes and hours',()=>{
  expect(formatStudyDuration(5000)).toBe('5s');expect(formatStudyDuration(65000)).toBe('1m 5s');expect(formatStudyDuration(3665000)).toBe('1h 1m');
 });
 it('counts consecutive active days and resets after a gap',()=>{
  const data={'2026-11-14':{total:10},'2026-11-13':{total:5},'2026-11-12':{total:2}};
  expect(calculateStudyStreak(data,new Date('2026-11-14T12:00:00'))).toBe(3);
  expect(calculateStudyStreak({'2026-11-10':{total:1}},new Date('2026-11-14T12:00:00'))).toBe(0);
 });
});
