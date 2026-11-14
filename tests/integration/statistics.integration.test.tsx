import {render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {beforeEach,describe,expect,it} from 'vitest';
import {LearningHub} from '../../src/features/learning/LearningHub';
async function seedLearning(data:any){
 await new Promise<void>((resolve,reject)=>{
  const r=indexedDB.open('gateprep-v2',1);
  r.onupgradeneeded=()=>r.result.createObjectStore('data');
  r.onsuccess=()=>{const db=r.result,t=db.transaction('data','readwrite');t.objectStore('data').put(data,'all');t.oncomplete=()=>{db.close();resolve();};t.onerror=()=>reject(t.error);};
  r.onerror=()=>reject(r.error);
 });
}
describe('statistics integration',()=>{
 beforeEach(()=>localStorage.clear());
 it('aggregates persisted attempts into accuracy and topic performance',async()=>{
  await seedLearning({
   questions:[{id:'q1',subject:'Algorithms',topic:'Searching',type:'MCQ',prompt:'Binary search',options:[{text:'A'},{text:'B'}],answers:['B'],marks:1,negative:.33,isPYQ:false,year:'',difficulty:'Medium',locked:true}],
   attempts:[{id:'a1',qid:'q1',at:new Date().toISOString(),correct:true,selected:['B'],seconds:12,mistake:'',note:''},{id:'a2',qid:'q1',at:new Date().toISOString(),correct:false,selected:['A'],seconds:18,mistake:'Conceptual mistake',note:'Missed invariant'}],
   bookmarks:['q1'],events:[],completedTopics:[],settings:{device:'Test',timer:0,order:'sequential'},backups:[]
  });
  render(<MemoryRouter><LearningHub mode="statistics"/></MemoryRouter>);
  await waitFor(()=>expect(screen.getByText('Attempts')).toBeInTheDocument());
  expect(document.querySelector('.learning-stats .metric-card:nth-child(1) strong')?.textContent).toBe('2');
  expect(document.querySelector('.learning-stats .metric-card:nth-child(2) strong')?.textContent).toBe('50%');
  expect(screen.getByText(/Searching/)).toBeInTheDocument();
  expect(screen.getByText(/1 correct · 1 wrong · 2 attempts · 1 unique questions/)).toBeInTheDocument();
 });
});
