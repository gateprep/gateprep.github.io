import {describe,expect,it} from 'vitest';
import {validateQuestionRecords} from '../../src/features/learning/questionBankLogic';
import {normalise} from '../../src/features/learning/LearningHub';
const q=(overrides:any={})=>({id:'q1',prompt:'Question',answers:['A'],type:'MCQ',options:[{text:'A'},{text:'B'}],...overrides});
describe('question bank unit logic',()=>{
 it('normalises older stored data and option strings',()=>{
  const data=normalise({questions:[{id:'q',options:['A','B']}],settings:{timer:10}});
  expect(data.questions[0].options).toEqual([{text:'A'},{text:'B'}]);
  expect(data.settings).toMatchObject({timer:10,device:'My device',order:'sequential'});
  expect(data.attempts).toEqual([]);
 });
 it('rejects missing prompts, answers, invalid options and nonnumeric NAT answers',()=>{
  expect(()=>validateQuestionRecords([q({prompt:''})])).toThrow(/no prompt/);
  expect(()=>validateQuestionRecords([q({answers:[]})])).toThrow(/answer key/);
  expect(()=>validateQuestionRecords([q({options:[{text:'A'}]})])).toThrow(/invalid options/);
  expect(()=>validateQuestionRecords([q({type:'NAT',options:[],answers:['abc']})])).toThrow(/numeric answer/);
 });
 it('rejects duplicate IDs inside an import and skips IDs already in the bank',()=>{
  expect(()=>validateQuestionRecords([q(),q()])).toThrow(/Duplicate IDs/);
  expect(validateQuestionRecords([q(),q({id:'q2'})],['q1'])).toEqual([q({id:'q2'})]);
 });
});
