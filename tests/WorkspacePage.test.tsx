import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe,expect,it} from 'vitest';
import {WorkspacePage} from '../src/features/workspace/WorkspacePage';
describe('WorkspacePage',()=>{it('renders the selected workspace and home navigation',()=>{render(<MemoryRouter><WorkspacePage section="Mistake Library"/></MemoryRouter>);expect(screen.getByRole('heading',{name:'Mistake Library.'})).toBeInTheDocument();expect(screen.getByRole('link',{name:/Back to home/})).toHaveAttribute('href','/');});});
