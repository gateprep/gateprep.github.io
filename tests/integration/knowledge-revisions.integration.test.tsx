import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {beforeEach,describe,expect,it} from 'vitest';
import {KnowledgeWorkspace} from '../../src/features/learning/KnowledgeWorkspace';
describe('knowledge revision integration',()=>{
 beforeEach(()=>localStorage.clear());
 it('persists a note, unlocks it, and records the previous body as a revision',async()=>{
  const view=render(<MemoryRouter><KnowledgeWorkspace mode="notes"/></MemoryRouter>);
  fireEvent.click(screen.getByRole('button',{name:/Create note/}));
  fireEvent.change(screen.getByLabelText('Title'),{target:{value:'Binary search'}});
  fireEvent.change(screen.getByPlaceholderText(/Write notes in Markdown/),{target:{value:'Original explanation'}});
  fireEvent.click(screen.getByRole('button',{name:/Save & lock/}));
  expect(await screen.findByRole('heading',{name:'Binary search'})).toBeInTheDocument();
  await waitFor(()=>expect(JSON.parse(localStorage.getItem('gateprep-knowledge-v1')||'[]')[0]).toMatchObject({locked:true,body:'Original explanation',versions:[]}));
  await waitFor(()=>expect(screen.getByRole('dialog')).toBeInTheDocument());
  fireEvent.click(screen.getByTitle('Unlock entry'));
  fireEvent.click(screen.getByTitle('Edit note'));
  fireEvent.change(screen.getByPlaceholderText(/Write notes in Markdown/),{target:{value:'Revised explanation'}});
  fireEvent.click(screen.getByRole('button',{name:/Save & lock/}));
  await waitFor(()=>{
   const saved=JSON.parse(localStorage.getItem('gateprep-knowledge-v1')||'[]')[0];
   expect(saved).toMatchObject({locked:true,body:'Revised explanation'});
   expect(saved.versions).toHaveLength(1);
   expect(saved.versions[0].body).toBe('Original explanation');
  });
  view.unmount();
  render(<MemoryRouter><KnowledgeWorkspace mode="notes"/></MemoryRouter>);
  expect(await screen.findByRole('heading',{name:'Binary search'})).toBeInTheDocument();
 });
});
