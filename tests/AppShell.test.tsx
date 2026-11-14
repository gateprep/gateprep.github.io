import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe,expect,it} from 'vitest';
import {AppShell} from '../src/app/layout/AppShell';
describe('AppShell',()=>{it('renders brand, navigation, theme controls and child route',()=>{render(<MemoryRouter><AppShell><p>Route content</p></AppShell></MemoryRouter>);expect(screen.getByText('GATE')).toBeInTheDocument();expect(screen.getByRole('navigation',{name:'Main navigation'})).toBeInTheDocument();expect(screen.getByTitle('Website theme')).toBeInTheDocument();expect(screen.getByText('Route content')).toBeInTheDocument();});it('persists initial theme and accent preferences',()=>{render(<MemoryRouter><AppShell><p>Content</p></AppShell></MemoryRouter>);expect(localStorage.getItem('gateprep-theme')).toBe('dark');expect(localStorage.getItem('gateprep-accent')).toBe('#b9f27c');});});
