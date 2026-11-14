import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {beforeEach,describe,expect,it} from 'vitest';
import {OthersPage} from '../../src/features/others/OthersPage';
describe('admissions persistence integration',()=>{
 beforeEach(()=>localStorage.clear());
 it('creates an application, changes its status, locks it, and retains the record after remount',async()=>{
  const view=render(<OthersPage section="Keep Track"/>);
  fireEvent.click(screen.getByRole('button',{name:/Add application/}));
  fireEvent.change(screen.getByPlaceholderText('e.g. M.Tech CSE application'),{target:{value:'M.Tech CSE 2027'}});
  fireEvent.change(screen.getByPlaceholderText('Institute name'),{target:{value:'IISc Bengaluru'}});
  fireEvent.click(screen.getByRole('button',{name:/Save/}));
  expect(await screen.findByText('M.Tech CSE 2027')).toBeInTheDocument();
  const status=screen.getByLabelText('Status');
  fireEvent.change(status,{target:{value:'Preparing documents'}});
  fireEvent.click(screen.getByRole('button',{name:'Unlock item'}));
  await waitFor(()=>{
   const saved=JSON.parse(localStorage.getItem('gateprep-admissions-v1')||'{}').applications[0];
   expect(saved).toMatchObject({title:'M.Tech CSE 2027',institute:'IISc Bengaluru',status:'Preparing documents',locked:true});
  });
  view.unmount();
  render(<OthersPage section="Keep Track"/>);
  expect(await screen.findByText('M.Tech CSE 2027')).toBeInTheDocument();
  expect(screen.getByLabelText('Status')).toBeDisabled();
 });
});
