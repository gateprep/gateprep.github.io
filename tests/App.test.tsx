import {render,screen} from '@testing-library/react';
import {describe,expect,it} from 'vitest';
import {App} from '../src/app/App';
describe('App composition',()=>{it('mounts the router inside the global shell',()=>{window.location.hash='#/';render(<App/>);expect(screen.getByRole('navigation',{name:'Main navigation'})).toBeInTheDocument();expect(screen.getByText(/Make every session/)).toBeInTheDocument();expect(screen.getByText('GATE CSE 2027')).toBeInTheDocument();});});
