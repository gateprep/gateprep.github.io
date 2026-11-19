import {render,screen} from '@testing-library/react';
import {describe,expect,it} from 'vitest';
import {Countdown} from '../src/shared/components/Countdown';
describe('Countdown',()=>{it('renders all four time units accessibly',()=>{render(<Countdown/>);expect(screen.getByLabelText('Time until configured exam date')).toBeInTheDocument();for(const unit of ['days','hours','minutes','seconds'])expect(screen.getByText(unit)).toBeInTheDocument();});});
