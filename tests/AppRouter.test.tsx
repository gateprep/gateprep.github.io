import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe,expect,it} from 'vitest';
import {AppRouter} from '../src/app/router';
describe('AppRouter',()=>{it.each([['/','Make every session count.'],['/subjects','Subject syllabus & completion'],['/quizzes','Quiz profiles'],['/notes','Notes.'],['/others/reminders','Reminders.'],['/others/eligible-courses','Eligible courses.']])('resolves %s to its feature page',async(path,expected)=>{render(<MemoryRouter initialEntries={[path]}><AppRouter/></MemoryRouter>);expect(await screen.findByRole('heading',{name:expected})).toBeInTheDocument();});it('redirects unknown paths to the dashboard',async()=>{render(<MemoryRouter initialEntries={['/not-a-real-route']}><AppRouter/></MemoryRouter>);expect(await screen.findByRole('heading',{name:'Make every session count.'})).toBeInTheDocument();});});
