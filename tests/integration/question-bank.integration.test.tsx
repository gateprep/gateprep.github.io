import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {beforeEach,describe,expect,it} from 'vitest';
import {LearningHub} from '../../src/features/learning/LearningHub';

async function readBank(){
 const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('gateprep-v2',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 return new Promise<any>((resolve,reject)=>{const r=db.transaction('data','readonly').objectStore('data').get('all');r.onsuccess=()=>{db.close();resolve(r.result);};r.onerror=()=>reject(r.error);});
}
describe('question-bank integration',()=>{
 beforeEach(()=>{localStorage.clear();});
 it('creates a locked question through the editor and persists its PYQ metadata in IndexedDB',async()=>{
  render(<MemoryRouter><LearningHub mode="quizzes"/></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button',{name:/Add question/}));
  expect(await screen.findByRole('heading',{name:'Add question'})).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Question text'),{target:{value:'What is the time complexity of binary search?'}});
  fireEvent.change(screen.getByPlaceholderText('Option A text (optional if image supplied)'),{target:{value:'O(n)'}});
  fireEvent.change(screen.getByPlaceholderText('Option B text (optional if image supplied)'),{target:{value:'O(log n)'}});
  fireEvent.click(screen.getByRole('radio',{name:'B'}));
  fireEvent.click(screen.getByLabelText('Previous Year Question'));
  fireEvent.change(screen.getByLabelText('GATE year'),{target:{value:'2024'}});
  fireEvent.click(screen.getByRole('button',{name:/Save & lock/}));
  await waitFor(async()=>{
   const bank=await readBank();
   expect(bank.questions).toHaveLength(1);
   expect(bank.questions[0]).toMatchObject({prompt:'What is the time complexity of binary search?',answers:['B'],isPYQ:true,year:'2024',locked:true});
  });
 });
});
