import {fireEvent,render,screen} from '@testing-library/react';
import {describe,expect,it} from 'vitest';
import {SettingsWorkspace} from '../src/features/settings/SettingsWorkspace';

describe('SettingsWorkspace synthetic data',()=>{
 it('generates a nested taxonomy, a 65-question 100-mark paper and linked local history',async()=>{
  render(<SettingsWorkspace/>);
  fireEvent.click(screen.getByRole('button',{name:'Generate synthetic data'}));
  expect(await screen.findByText(/Created 165 questions, 65-question PYQ paper/)).toBeInTheDocument();
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open('gateprep-v2',1);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  const learning=await new Promise<any>((resolve,reject)=>{const req=db.transaction('data','readonly').objectStore('data').get('all');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  db.close();
  expect(learning.questions).toHaveLength(165);
  const paper=learning.questions.filter((q:any)=>q.isPYQ);
  expect(paper).toHaveLength(65);
  expect(paper.reduce((n:number,q:any)=>n+q.marks,0)).toBe(100);
  expect(paper.filter((q:any)=>q.subject==='General Aptitude')).toHaveLength(10);
  const taxonomy=JSON.parse(localStorage.getItem('gateprep-taxonomy-v1')||'{}');
  const course=taxonomy.courses.find((x:any)=>x.id==='synthetic-gate-cse-2027');
  expect(course.nodes).toHaveLength(12);
  expect(JSON.parse(localStorage.getItem('gateprep-knowledge-v1')||'[]')).toHaveLength(36);
  const tests=JSON.parse(localStorage.getItem('gateprep-assessments-v1')||'{}').tests;
  expect(tests).toHaveLength(3);
  expect(tests[0].questions).toHaveLength(30);
  expect(new Set(tests[0].questions.map((q:any)=>q.subject))).toEqual(new Set(['Algorithms']));
  expect(tests[2].questions.reduce((n:number,q:any)=>n+q.marks,0)).toBe(100);
  expect(JSON.parse(localStorage.getItem('gateprep-admissions-v1')||'{}').applications).toHaveLength(2);
  expect(JSON.parse(localStorage.getItem('gateprep-synthetic-history-v1')||'[]')).toHaveLength(1);
 });
});
