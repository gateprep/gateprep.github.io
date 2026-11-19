import {describe,expect,it} from 'vitest';
import {buildApplicationRecord,patchRecord,removeRecord} from '../../src/features/others/admissionsLogic';
describe('admissions unit logic',()=>{
 it('requires an application title and applies defaults',()=>{
  expect(buildApplicationRecord({title:' '},'1')).toBeNull();
  expect(buildApplicationRecord({title:'M.Tech CSE'},'1')).toMatchObject({id:'1',title:'M.Tech CSE',track:'M.Tech',status:'Researching',locked:false});
 });
 it('preserves the existing lock state during edits',()=>{
  const existing={locked:true};
  expect(buildApplicationRecord({title:'PhD'},'1',existing)?.locked).toBe(true);
  expect(buildApplicationRecord({title:'PhD'},'1',{locked:false})?.locked).toBe(false);
 });
 it('patches only the selected record and removes only the selected record',()=>{
  const rows=[{id:'a',status:'Applied'},{id:'b',status:'Researching'}];
  expect(patchRecord(rows,'a',{status:'Accepted'})).toEqual([{id:'a',status:'Accepted'},{id:'b',status:'Researching'}]);
  expect(removeRecord(rows,'a')).toEqual([{id:'b',status:'Researching'}]);
 });
});
