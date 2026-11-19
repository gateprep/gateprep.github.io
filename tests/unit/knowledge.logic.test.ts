import {describe,expect,it} from 'vitest';
import {buildKnowledgeRevision,canSaveKnowledgeTitle} from '../../src/features/learning/knowledgeLogic';
describe('knowledge unit logic',()=>{
 it('requires a nonblank title',()=>{expect(canSaveKnowledgeTitle('  ')).toBe(false);expect(canSaveKnowledgeTitle('Algorithms')).toBe(true);});
 it('records the previous title and body only when the body changes',()=>{
  const old=[{at:'older',body:'v0',title:'Old'}];
  expect(buildKnowledgeRevision(old,'v1','Binary search','v2','now')).toEqual([{at:'now',body:'v1',title:'Binary search'},...old]);
  expect(buildKnowledgeRevision(old,'v1','Binary search','v1','now')).toBe(old);
 });
 it('caps revision history at 100 entries',()=>{
  const old=Array.from({length:100},(_,i)=>({at:String(i),body:String(i),title:'T'}));
  const next=buildKnowledgeRevision(old,'previous','Title','current','new');
  expect(next).toHaveLength(100);expect(next[0].at).toBe('new');expect(next.at(-1)?.at).toBe('98');
 });
});
