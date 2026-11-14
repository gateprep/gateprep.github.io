import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe,expect,it} from 'vitest';
import {LearningHub} from '../src/features/learning/LearningHub';
describe('LearningHub',()=>{it('loads the subject syllabus and completion checklist',async()=>{render(<MemoryRouter><LearningHub mode="subjects"/></MemoryRouter>);expect(await screen.findByText('Subject syllabus & completion')).toBeInTheDocument();expect(screen.getByText('Algorithms')).toBeInTheDocument();expect(screen.getByText('Computer Networks')).toBeInTheDocument();expect(screen.getByRole('button',{name:/Unlock progress/})).toBeInTheDocument();});it('renders the local backup and restore workspace',async()=>{render(<MemoryRouter><LearningHub mode="backup"/></MemoryRouter>);expect(await screen.findByRole('heading',{name:'Backup device'})).toBeInTheDocument();expect(screen.getByRole('button',{name:/Export backup/})).toBeInTheDocument();});});
