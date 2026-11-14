import {describe,expect,it} from 'vitest';
import {calculateTestScore,isAnswerCorrect,questionPriority} from '../../src/features/learning/assessmentLogic';
import {calc,normalise,ok,validate} from '../../src/features/learning/AssessmentEngine';
const q=(id:string,type:'MCQ'|'MSQ'|'NAT',answers:string[],marks=1,negative=.33)=>({id,type,answers,marks,negative,difficulty:'Medium'});
describe('assessment unit logic',()=>{
 it('scores MCQ negative marking and leaves MSQ/NAT without negative marking',()=>{
  const result=calculateTestScore([q('a','MCQ',['A'],1,.33),q('b','MSQ',['A','C'],2,.5),q('c','NAT',['42'],2,.5)],{a:['B'],b:['A'],c:['42']});
  expect(result).toEqual({correct:1,wrong:2,unanswered:0,score:1.67,maxMarks:5});
 });
 it('counts unanswered separately and compares MSQ as an exact set',()=>{
  expect(calculateTestScore([q('a','MSQ',['A','B'])],{a:['A','B','C']})).toMatchObject({correct:0,wrong:1,unanswered:0,score:0});
  expect(calculateTestScore([q('a','MCQ',['A'])],{})).toMatchObject({correct:0,wrong:0,unanswered:1,score:0});
 });
 it('accepts trimmed NAT strings and exact MCQ/MSQ keys',()=>{
  expect(isAnswerCorrect(q('n','NAT',['42']),[' 42 '])).toBe(true);
  expect(isAnswerCorrect(q('m','MSQ',['A','C']),['C','A'])).toBe(true);
  expect(isAnswerCorrect(q('m','MSQ',['A','C']),['A'])).toBe(false);
 });
 it('prioritises repeated errors and difficulty while rewarding bookmarks and correct history',()=>{
  const question={id:'q',difficulty:'Hard'};
  expect(questionPriority(question,[{qid:'q',correct:false},{qid:'q',correct:false}],[],true)).toBeGreaterThan(questionPriority(question,[{qid:'q',correct:true}],[],true));
  expect(questionPriority(question,[],['q'])).toBeGreaterThan(questionPriority(question,[],[]));
 });
 it('normalises legacy question fields and locks imported questions',()=>{
  expect(normalise({id:'q',question:'Prompt',options:['A','B'],correctAnswers:['B'],negativeMarks:.25})).toMatchObject({prompt:'Prompt',options:[{text:'A'},{text:'B'}],answers:['B'],negative:.25,locked:true});
 });
 it('validates test-series size, subject/topic, duplicate IDs and 100-mark full tests',()=>{
  const base={id:'q',subject:'Algorithms',topic:'Searching',type:'MCQ',prompt:'Prompt',options:['A','B'],answers:['A'],marks:1,negative:0};
  expect(()=>validate([base],'subject')).toThrow(/exactly 30/);
  const thirty=Array.from({length:30},(_,i)=>({...base,id:'q'+i}));
  expect(validate(thirty,'subject')).toHaveLength(30);
  expect(()=>validate([...thirty.slice(0,29),{...base,id:'q0'}],'subject')).toThrow(/Duplicate/);
  expect(()=>calc('2+2*3')).toBe('8');
  expect(()=>validate(Array.from({length:65},(_,i)=>({...base,id:'f'+i,marks:1})),'full')).toThrow(/100 marks/);
 });
});
