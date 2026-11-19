import {fireEvent,render,screen,within} from '@testing-library/react';
import {describe,expect,it,vi,beforeEach} from 'vitest';
import {PYQYearWorkspace} from '../src/features/learning/PYQYearWorkspace';

function paper(year='2026',count=65){
 return Array.from({length:count},(_,i)=>{
  const isGA=i<10,sectionIndex=isGA?i:i-10,marks=isGA?(sectionIndex<5?1:2):(sectionIndex<25?1:2);
  return {id:year+'-'+i,courseId:'gate-cse-2027',subject:isGA?'General Aptitude':'Algorithms',topic:isGA?'Verbal Aptitude':'Algorithms / Graphs',type:'MCQ' as const,prompt:'GATE '+year+' question '+(i+1),options:[{text:'Option A'},{text:'Option B'}],answers:['A'],explanation:'Explanation',marks,negative:Number((marks/3).toFixed(2)),isPYQ:true,year,difficulty:'Medium',locked:true};
 });
}
describe('PYQ year papers',()=>{
 beforeEach(()=>{localStorage.clear();});
 it('lists years newest first and shows missing question, mark and section counts',()=>{
  render(<PYQYearWorkspace questions={[...paper('2024'),...paper('2026',64)]} onRecord={vi.fn()} onUnlock={vi.fn()}/>);
  const cards=screen.getAllByRole('article');
  expect(cards[0]).toHaveTextContent('GATE 2026');
  expect(cards[1]).toHaveTextContent('GATE 2024');
  expect(cards[0]).toHaveTextContent('64/65');
  expect(cards[0]).toHaveTextContent('Missing 1');
  expect(cards[0]).toHaveTextContent('Missing 2');
  fireEvent.click(within(cards[0]).getByRole('button',{name:'View missing sections'}));
  expect(screen.getByText('64/65')).toBeInTheDocument();
  expect(screen.getByText(/General Aptitude/)).toBeInTheDocument();
 });
 it('opens a complete 65-question, 100-mark paper in the GATE test interface',()=>{
  render(<PYQYearWorkspace questions={paper()} onRecord={vi.fn()} onUnlock={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:'Open GATE paper'}));
  expect(screen.getByText(/65 questions · 100 marks · 180 minutes/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Start test/}));
  expect(screen.getByText('Question 1 of 65')).toBeInTheDocument();
  expect(screen.getByText('GATE 2026 question 1')).toBeInTheDocument();
 });
});
