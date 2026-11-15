import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe,expect,it} from 'vitest';
import {StudyPlanWorkspace} from '../src/features/learning/StudyPlanWorkspace';
import {TimerWorkspace} from '../src/features/learning/TimerWorkspace';
import {KnowledgeWorkspace} from '../src/features/learning/KnowledgeWorkspace';
describe('new learning workspaces',()=>{
 it('creates a dated study-plan schedule and persists it locally',async()=>{
  render(<StudyPlanWorkspace/>);
  expect(screen.getByRole('heading',{name:'Study Plan.'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Add schedule/}));
  fireEvent.change(screen.getByLabelText('Schedule title'),{target:{value:'Algorithms revision'}});
  fireEvent.click(screen.getByRole('button',{name:/Save schedule/}));
  await waitFor(()=>expect(JSON.parse(localStorage.getItem('gateprep-study-plan-v1')||'[]')).toHaveLength(1));
  expect(JSON.parse(localStorage.getItem('gateprep-study-plan-v1')||'[]')[0].title).toBe('Algorithms revision');
 });
 it('creates and persists a duration countdown',async()=>{
  render(<TimerWorkspace/>);
  fireEvent.click(screen.getByRole('button',{name:/Add timer/}));
  fireEvent.change(screen.getByLabelText('Timer name'),{target:{value:'Focused study'}});
  fireEvent.click(screen.getByRole('button',{name:'Create timer'}));
  await waitFor(()=>expect(JSON.parse(localStorage.getItem('gateprep-countdown-timers-v1')||'[]')).toHaveLength(1));
  expect(screen.getByText('Focused study')).toBeInTheDocument();
 });
 it('provides Motivation with the same editable knowledge workspace',()=>{
  render(<MemoryRouter><KnowledgeWorkspace mode="motivation"/></MemoryRouter>);
  expect(screen.getByRole('heading',{name:'Motivation.'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Create motivation entry/}));
  expect(screen.getByRole('heading',{name:'New motivation'})).toBeInTheDocument();
 });
});
