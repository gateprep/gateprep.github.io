import {fireEvent,render,screen} from '@testing-library/react';
import {describe,expect,it,vi} from 'vitest';
import {AssessmentEngine} from '../src/features/learning/AssessmentEngine';
import {TestSeriesWorkspace} from '../src/features/learning/TestSeriesWorkspace';
import {validate} from '../src/features/learning/AssessmentEngine';
import {GateCalculator} from '../src/features/learning/GateCalculator';
const base={questions:[],attempts:[],bookmarks:[],onRecord:vi.fn(),onUnlock:vi.fn()};
describe('AssessmentEngine',()=>{it('renders quiz profiles and cadence tabs',()=>{render(<AssessmentEngine {...base} mode="quizzes"/>);expect(screen.getByRole('heading',{name:'Quiz profiles'})).toBeInTheDocument();for(const name of ['Daily','Weekly','Monthly','Custom'])expect(screen.getByRole('button',{name})).toBeInTheDocument();expect(screen.getByRole('button',{name:/Create quiz profile/})).toBeInTheDocument();expect(screen.getByRole('button',{name:/Add question/})).toBeInTheDocument();expect(screen.getByText(/Import questions/)).toBeInTheDocument();});it('keeps test-series import separate from quiz-only controls',()=>{render(<AssessmentEngine {...base} mode="tests"/>);expect(screen.getByRole('heading',{name:'Test series'})).toBeInTheDocument();expect(screen.getByText(/No subject-wise test profiles yet/)).toBeInTheDocument();expect(screen.getByRole('button',{name:/Subject-wise/})).toHaveAttribute('aria-pressed','true');expect(screen.queryByRole('button',{name:/Create quiz profile/})).not.toBeInTheDocument();expect(screen.queryByRole('button',{name:/Add question/})).not.toBeInTheDocument();expect(screen.getAllByRole('button',{name:/Import \/ Paste JSON/})).toHaveLength(2);});});

describe('TestSeriesWorkspace',()=>{it('shows the question beside a numbered palette and supports direct navigation',()=>{const questions=Array.from({length:30},(_,i)=>({id:'q'+i,subject:'Algorithms',topic:'Searching',type:'MCQ' as const,prompt:'Visible question '+(i+1),options:[{text:'Option A'},{text:'Option B'}],answers:['A'],explanation:'Because A is correct.',marks:1,negative:.33,isPYQ:false,year:'',difficulty:'Medium',locked:true}));const test={id:'t1',title:'CBT layout test',kind:'subject' as const,duration:90,questions,history:[]};const {unmount}=render(<TestSeriesWorkspace tests={[test]} onTestsChange={vi.fn()} parseFile={vi.fn()} validateJson={vi.fn()} onRecord={vi.fn()} onUnlock={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:/Start test/}));expect(screen.getByText('Visible question 1')).toBeInTheDocument();expect(screen.getByText('Question palette')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:/Question 2 not-visited/}));expect(screen.getByText('Visible question 2')).toBeInTheDocument();unmount();});});

describe('test-series type filters',()=>{it('switches between subject-wise, mixed and full-length test profiles',()=>{const make=(id:string,title:string,kind:'subject'|'mixed'|'full')=>({id,title,kind,duration:kind==='full'?180:90,questions:[],history:[]});render(<TestSeriesWorkspace tests={[make('s','Subject test','subject'),make('m','Mixed test','mixed'),make('f','Full test','full')]} onTestsChange={vi.fn()} parseFile={vi.fn()} validateJson={vi.fn()} onRecord={vi.fn()} onUnlock={vi.fn()}/>);expect(screen.getByText('Subject test')).toBeInTheDocument();expect(screen.queryByText('Mixed test')).not.toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:/Mixed/}));expect(screen.getByText('Mixed test')).toBeInTheDocument();expect(screen.queryByText('Subject test')).not.toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:/Full length/}));expect(screen.getByText('Full test')).toBeInTheDocument();expect(screen.queryByText('Mixed test')).not.toBeInTheDocument();});});


describe('GATE full-test JSON validation',()=>{it('accepts editable section labels across six sections while enforcing 65 questions and 100 marks',()=>{const questions=Array.from({length:65},(_,i)=>{const marks=i<30?1:2;return {id:'custom-'+i,subject:'Section '+(i%6+1),topic:'Custom topic '+(i%4+1),type:'MCQ',prompt:'Question '+i,options:['A','B','C','D'],answers:['A'],marks,negative:Number((marks/3).toFixed(2))};});const parsed=validate({questions},'full');expect(parsed).toHaveLength(65);expect(new Set(parsed.map(q=>q.subject)).size).toBe(6);expect(parsed.reduce((n,q)=>n+q.marks,0)).toBe(100);});});

describe('GATE calculator',()=>{it('evaluates arithmetic and degree-mode scientific functions',()=>{render(<GateCalculator onClose={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:'3'}));fireEvent.click(screen.getByRole('button',{name:'0'}));fireEvent.click(screen.getByRole('button',{name:'sin'}));expect(screen.getByText('0.5')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'C'}));for(const digit of ['2','0','0','%','1','0','='])fireEvent.click(screen.getByRole('button',{name:digit}));expect(screen.getAllByText('20').some(el=>el.tagName==='OUTPUT')).toBe(true);});});

describe('GATE test navigation and submit confirmation',()=>{it('saves an unanswered question and moves forward, then confirms before submission',()=>{const questions=Array.from({length:30},(_,i)=>({id:'blank'+i,subject:'Custom section',topic:'Custom topic',type:'MCQ' as const,prompt:'Question '+(i+1),options:[{text:'A'},{text:'B'}],answers:['A'],explanation:'',marks:1,negative:.33,isPYQ:false,year:'',difficulty:'Medium',locked:true}));const test={id:'blank-test',title:'Blank save test',kind:'subject' as const,duration:90,questions,history:[]};render(<TestSeriesWorkspace tests={[test]} onTestsChange={vi.fn()} parseFile={vi.fn()} validateJson={vi.fn()} onRecord={vi.fn()} onUnlock={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:/Start test/}));fireEvent.click(screen.getByRole('button',{name:/Save & Next/}));expect(screen.getByText(/Question 2 of 30/)).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Submit test'}));expect(screen.getByRole('heading',{name:'Submit this test?'})).toBeInTheDocument();expect(screen.getByText(/0 attempted/)).toBeInTheDocument();expect(screen.getByText(/30 not attempted/)).toBeInTheDocument();});});


describe('quiz profile import and reporting',()=>{
 it('imports pasted quiz JSON into a profile and the shared question bank',()=>{
  const onImportToBank=vi.fn();
  render(<AssessmentEngine {...base} mode="quizzes" onImportToBank={onImportToBank}/>);
  fireEvent.click(screen.getByRole('button',{name:/Import questions/}));
  fireEvent.click(screen.getByRole('button',{name:'Paste JSON'}));
  fireEvent.change(screen.getByPlaceholderText(/Paste one quiz JSON/),{target:{value:JSON.stringify({title:'Algorithms revision',questions:[{id:'quiz-import-1',subject:'Algorithms',topic:'Sorting',type:'MCQ',prompt:'Which sorting algorithm is stable?',options:['Merge sort','Heap sort'],answers:['A'],marks:1,negative:.33}]})}});
  fireEvent.click(screen.getByRole('button',{name:'Validate JSON'}));
  expect(screen.getByText(/1 profile\(s\).*1 questions.*0 possible duplicates/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Import quiz profile(s)'}));
  expect(onImportToBank).toHaveBeenCalledWith([expect.objectContaining({id:'quiz-import-1',locked:false})]);
  expect(screen.getByText('Algorithms revision')).toBeInTheDocument();
 });
 it('flags duplicate quiz questions and lets the user choose to add a copy',()=>{
  const existing={id:'bank-1',subject:'Algorithms',topic:'Sorting',type:'MCQ' as const,prompt:'Which sorting algorithm is stable?',options:[{text:'Merge sort'},{text:'Heap sort'}],answers:['A'],explanation:'',marks:1,negative:.33,isPYQ:false,year:'',difficulty:'Medium',locked:false};
  const onImportToBank=vi.fn();
  render(<AssessmentEngine {...base} mode="quizzes" questions={[existing]} onImportToBank={onImportToBank}/>);
  fireEvent.click(screen.getByRole('button',{name:/Import questions/}));
  fireEvent.click(screen.getByRole('button',{name:'Paste JSON'}));
  fireEvent.change(screen.getByPlaceholderText(/Paste one quiz JSON/),{target:{value:JSON.stringify({title:'Duplicate quiz',questions:[{id:'quiz-duplicate-1',subject:'Algorithms',topic:'Sorting',type:'MCQ',prompt:existing.prompt,options:['Merge sort','Heap sort'],answers:['A'],marks:1,negative:.33}]})}});
  fireEvent.click(screen.getByRole('button',{name:'Validate JSON'}));
  expect(screen.getByText(/Duplicate of: Which sorting algorithm is stable/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('checkbox',{name:'Add duplicate quiz-duplicate-1 anyway'}));
  fireEvent.click(screen.getByRole('button',{name:'Import quiz profile(s)'}));
  expect(onImportToBank).toHaveBeenCalledWith([expect.objectContaining({prompt:existing.prompt,locked:false})]);
 });
 it('shows a saved quiz report with subject/topic breakdown and right/wrong bars',()=>{
  const q1={id:'report-q1',subject:'Algorithms',topic:'Sorting',type:'MCQ' as const,prompt:'Question one',options:[{text:'Correct'},{text:'Wrong'}],answers:['A'],explanation:'A is correct.',marks:1,negative:.33,isPYQ:false,year:'',difficulty:'Medium',locked:false};
  const q2={...q1,id:'report-q2',prompt:'Question two'};
  localStorage.setItem('gateprep-assessments-v1',JSON.stringify({profiles:[{id:'report-profile',name:'Report quiz',kind:'custom',subjects:['Algorithms'],topics:[],questionIds:[q1.id,q2.id],history:[]}],tests:[],activeQuiz:null,activeTest:null,daily:'',weekly:'',monthly:'',quizMinutes:5}));
  render(<AssessmentEngine {...base} mode="quizzes" questions={[q1,q2]}/>);
  fireEvent.click(screen.getByRole('button',{name:'Custom'}));
  fireEvent.click(screen.getByRole('button',{name:/Start/}));
  fireEvent.click(screen.getAllByRole('radio')[0]);
  fireEvent.click(screen.getByRole('button',{name:/Next/}));
  fireEvent.click(screen.getAllByRole('radio')[1]);
  fireEvent.click(screen.getByRole('button',{name:/Submit quiz/}));
  fireEvent.click(screen.getByRole('button',{name:'Save and finish'}));
  expect(screen.getByRole('heading',{name:'Report quiz'})).toBeInTheDocument();
  expect(screen.getByText('1 right · 1 wrong · 0 skipped')).toBeInTheDocument();
  expect(document.querySelector('.gate-topic-grid i em')).toHaveStyle({width:'50%'});
 });
});


describe('test-series report topic coverage',()=>{
 it('reports only subject/topic pairs present in the test and displays incorrect answers in red',()=>{
  const questions=Array.from({length:30},(_,i)=>({id:'topic-report-'+i,subject:'Algorithms',topic:i===0?'Sorting':'Searching',type:'MCQ' as const,prompt:'Topic report question '+i,options:[{text:'Correct'},{text:'Wrong'}],answers:['A'],explanation:'',marks:1,negative:.33,isPYQ:false,year:'',difficulty:'Medium',locked:true}));
  const test={id:'topic-report-test',title:'Topic coverage report',kind:'subject' as const,duration:90,questions,history:[]};
  render(<TestSeriesWorkspace tests={[test]} onTestsChange={vi.fn()} parseFile={vi.fn()} validateJson={vi.fn()} onRecord={vi.fn()} onUnlock={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:/Start test/}));
  fireEvent.click(screen.getAllByRole('radio')[1]);
  fireEvent.click(screen.getByRole('button',{name:/Save & Next/}));
  fireEvent.click(screen.getByRole('button',{name:'Submit test'}));
  fireEvent.click(screen.getByRole('button',{name:'Confirm submission'}));
  expect(screen.getByText('Algorithms / Sorting')).toBeInTheDocument();
  expect(screen.getByText('Algorithms / Searching')).toBeInTheDocument();
  expect(screen.queryByText(/Unrelated topic/)).not.toBeInTheDocument();
  expect(screen.getByText('0 right · 1 wrong · 0 skipped')).toBeInTheDocument();
  expect(document.querySelector('.gate-topic-grid i em')).toHaveStyle({width:'100%'});
 });
});
