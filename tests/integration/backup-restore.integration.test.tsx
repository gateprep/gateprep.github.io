import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {beforeEach,describe,expect,it,vi} from 'vitest';
import {LearningHub} from '../../src/features/learning/LearningHub';
describe('backup restore integration',()=>{
 beforeEach(()=>{localStorage.clear();vi.restoreAllMocks();});
 it('restores a supported legacy backup into the learning database after confirmation',async()=>{
  vi.spyOn(window,'confirm').mockReturnValue(true);
  render(<MemoryRouter><LearningHub mode="backup"/></MemoryRouter>);
  expect(await screen.findByRole('heading',{name:'Backup device'})).toBeInTheDocument();
  const backup={contentType:'gateprep_backup',data:{
   questions:[{id:'restored-q',subject:'Algorithms',topic:'Searching',type:'MCQ',prompt:'Restored question',options:[{text:'A'},{text:'B'}],answers:['B'],marks:1,negative:.33,isPYQ:true,year:'2024',difficulty:'Medium',locked:true}],
   attempts:[{id:'restored-a',qid:'restored-q',at:new Date().toISOString(),correct:true,selected:['B'],seconds:10,mistake:'',note:''}],
   bookmarks:['restored-q'],events:[],completedTopics:[],settings:{device:'Backup device',timer:0,order:'sequential'},backups:[]
  }};
  const file=new File([JSON.stringify(backup)],'gateprep-legacy.json',{type:'application/json'});
  const input=document.querySelector('input[type="file"]');
  if(!input)throw new Error('Restore file input not found');
  fireEvent.change(input,{target:{files:[file]}});
  expect(await screen.findByText(/Backup verified and restored/)).toBeInTheDocument();
  await waitFor(async()=>{
   const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('gateprep-v2',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
   const data=await new Promise<any>((resolve,reject)=>{const r=db.transaction('data','readonly').objectStore('data').get('all');r.onsuccess=()=>{db.close();resolve(r.result);};r.onerror=()=>reject(r.error);});
   expect(data.questions[0]).toMatchObject({id:'restored-q',isPYQ:true,year:'2024'});
   expect(data.attempts[0]).toMatchObject({id:'restored-a',correct:true});
  });
 });
});
