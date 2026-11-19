import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe,expect,it} from 'vitest';
import {DashboardPage} from '../src/features/dashboard/DashboardPage';
describe('DashboardPage',()=>{it('renders its overview and ten workspace destinations',()=>{render(<MemoryRouter><DashboardPage/></MemoryRouter>);expect(screen.getByText(/Make every session/)).toBeInTheDocument();expect(screen.getByRole('link',{name:/Subjects/})).toHaveAttribute('href','/subjects');expect(screen.getByRole('link',{name:/Backup & Restore/})).toHaveAttribute('href','/backup');expect(screen.getAllByRole('link')).toHaveLength(10);});});
