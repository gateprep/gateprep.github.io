import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {beforeEach,describe,expect,it,vi} from 'vitest';
import {AssessmentEngine} from '../../src/features/learning/AssessmentEngine';

const question={id:'q-assess-1',subject:'Algorithms',topic:'Searching',type:'MCQ' as const,prompt:'Which search is logarithmic on a sorted array?',options:[{text:'Linear search'},{text:'Binary search'}],answers:['B'],explanation:'Binary search halves the search interval.',marks:1,negative:0.33,isPYQ:false,year:'',difficulty:'Medium',locked:true};
describe('assessment integration flow',()=>{
 beforeEach(()=>localStorage.clear());
 it('records an answered quiz in both the callback and persistent profile history',async()=>{
  const onRecord=vi.fn();
  render(<AssessmentEngine mode="quizzes" questions={[question]} attempts={[]} bookmarks={[]} onRecord={onRecord} onUnlock={vi.fn()}/>);
  const start=await screen.findByRole('button',{name:/Start/});
  fireEvent.click(start);
  const answer=await screen.findByLabelText(/Binary search/);
  fireEvent.click(answer);
  fireEvent.click(screen.getByRole('button',{name:/Submit quiz/}));
  await waitFor(()=>expect(onRecord).toHaveBeenCalledTimes(1));
  expect(onRecord.mock.calls[0][0][0]).toMatchObject({qid:'q-assess-1',correct:true,selected:['B']});
  await waitFor(()=>{
   const saved=JSON.parse(localStorage.getItem('gateprep-assessments-v1')||'{}');
   expect(saved.profiles[0].history[0]).toMatchObject({correct:1,wrong:0,skipped:0});
   expect(saved.activeQuiz).toBeNull();
  });
 });
});
