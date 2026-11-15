import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,describe,expect,it} from 'vitest';
import {LearningHub} from '../src/features/learning/LearningHub';
async function seedLearning(data:any){
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open('gateprep-v2',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('data'))req.result.createObjectStore('data');};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
 await new Promise<void>((resolve,reject)=>{const tx=db.transaction('data','readwrite');tx.objectStore('data').put(data,'all');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});db.close();
}
const question={id:'question-1',subject:'Algorithms',topic:'Searching',type:'MCQ',prompt:'Which option is correct?',options:[{text:'Correct'},{text:'Incorrect'}],answers:['A'],explanation:'Binary search needs sorted input.',marks:1,negative:0,isPYQ:false,year:'',difficulty:'Easy',locked:false};
describe('question attempt feedback',()=>{
 afterEach(async()=>{await new Promise<void>(resolve=>{const req=indexedDB.deleteDatabase('gateprep-v2');req.onsuccess=()=>resolve();req.onerror=()=>resolve();req.onblocked=()=>resolve();});});
 it('uses red incorrect feedback and a custom close confirmation',async()=>{
  await seedLearning({questions:[question],attempts:[],bookmarks:[],events:[],completedTopics:[],settings:{device:'Test',timer:0,order:'sequential'},backups:[]});
  render(<MemoryRouter><LearningHub mode="questions"/></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button',{name:'Attempt'}));
  fireEvent.click(screen.getByLabelText('B'));
  fireEvent.click(screen.getByRole('button',{name:/Submit answer/}));
  await waitFor(()=>expect(document.querySelector('.answer-explanation.incorrect')).toBeInTheDocument());
  fireEvent.click(screen.getByTitle('Close attempt'));
  expect(await screen.findByRole('heading',{name:'Leave this attempt?'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Continue attempt'}));
  expect(screen.getByRole('heading',{name:'Question attempt'})).toBeInTheDocument();
 });
});
