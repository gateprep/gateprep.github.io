import {fireEvent,render,screen} from '@testing-library/react';
import {afterEach,describe,expect,it} from 'vitest';
import {TaxonomyManager} from '../src/features/learning/TaxonomyManager';

afterEach(()=>localStorage.clear());

describe('TaxonomyManager course protection',()=>{
 it('keeps syllabus fields read-only until the active course is unlocked',()=>{
  render(<TaxonomyManager open onClose={()=>{}}/>);
  expect(screen.getAllByLabelText('Course name')[0]).toBeDisabled();
  expect(screen.getByLabelText('GATE paper / track')).toBeDisabled();
  expect(screen.getByRole('button',{name:/Add node/})).toBeDisabled();
  fireEvent.click(screen.getByRole('button',{name:/Locked.*Unlock to edit/}));
  expect(screen.getAllByLabelText('Course name')[0]).toBeEnabled();
  expect(screen.getByLabelText('GATE paper / track')).toBeEnabled();
  expect(screen.getByRole('button',{name:/Add node/})).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Add subject'),{target:{value:'New subject'}});
  expect(screen.getByRole('button',{name:/Add node/})).toBeEnabled();
 });
 it('locks the course again and disables hierarchy actions',()=>{
  render(<TaxonomyManager open onClose={()=>{}}/>);
  fireEvent.click(screen.getByRole('button',{name:/Locked.*Unlock to edit/}));
  fireEvent.click(screen.getByRole('button',{name:/Unlocked.*Lock syllabus/}));
  expect(screen.getAllByLabelText('Course name')[0]).toBeDisabled();
  expect(screen.getByRole('button',{name:/Add node/})).toBeDisabled();
 });
});
