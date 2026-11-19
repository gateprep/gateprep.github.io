import {fireEvent,render,screen} from '@testing-library/react';
import {afterEach,describe,expect,it} from 'vitest';
import {TaxonomyManager} from '../src/features/learning/TaxonomyManager';
import {defaultCatalog,saveTaxonomy} from '../src/features/learning/taxonomy';

afterEach(()=>localStorage.clear());
const seedSmallCatalog=()=>{const catalog=defaultCatalog();catalog.courses[0].nodes=[{id:'algorithms',name:'Algorithms',children:[{id:'searching',name:'Searching',children:[]}]}];saveTaxonomy(catalog);};

describe('TaxonomyManager course protection',()=>{
 it('keeps syllabus fields read-only until the active course is unlocked',()=>{
  seedSmallCatalog();
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
  seedSmallCatalog();
  render(<TaxonomyManager open onClose={()=>{}}/>);
  fireEvent.click(screen.getByRole('button',{name:/Locked.*Unlock to edit/}));
  fireEvent.click(screen.getByRole('button',{name:/Unlocked.*Lock syllabus/}));
  expect(screen.getAllByLabelText('Course name')[0]).toBeDisabled();
  expect(screen.getByRole('button',{name:/Add node/})).toBeDisabled();
 });
});
