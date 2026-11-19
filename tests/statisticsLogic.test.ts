import {describe,expect,it} from 'vitest';
import {buildTopicStats} from '../src/features/learning/statisticsLogic';

describe('nested topic statistics',()=>{
  it('rolls attempts up through every taxonomy ancestor and preserves the deepest path',()=>{
    const questions=[
      {id:'q1',subject:'Operating Systems',topic:'Processes / Process States / Ready Queue'},
      {id:'q2',subject:'Operating Systems',topic:'Processes / Context Switching'},
      {id:'q3',subject:'Operating Systems',topic:'CPU Scheduling / Round Robin'},
    ];
    const attempts=[
      {qid:'q1',correct:false,selected:['A']},
      {qid:'q1',correct:true,selected:['B']},
      {qid:'q1',correct:false,selected:['C']},
      {qid:'q2',correct:true,selected:['A']},
      {qid:'q3',correct:false,selected:['D']},
    ];
    const rows=buildTopicStats(questions,attempts);
    const byPath=new Map(rows.map(row=>[row.topic,row]));
    expect(byPath.get('Processes')).toMatchObject({correct:2,wrong:2,total:4,uniqueQuestions:2,depth:1});
    expect(byPath.get('Processes / Process States')).toMatchObject({correct:1,wrong:2,total:3,uniqueQuestions:1,depth:2});
    expect(byPath.get('Processes / Process States / Ready Queue')).toMatchObject({correct:1,wrong:2,total:3,uniqueQuestions:1,depth:3});
    expect(byPath.get('CPU Scheduling / Round Robin')).toMatchObject({correct:0,wrong:1,total:1,depth:2});
  });

  it('does not count skipped attempts as performance data',()=>{
    const rows=buildTopicStats([{id:'q1',subject:'Algorithms',topic:'Graphs / Traversal'}],[{qid:'q1',correct:false,selected:[]}]);
    expect(rows).toHaveLength(0);
  });
});
