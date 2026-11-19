import {describe,expect,it} from 'vitest';
import {navigationItems} from '../src/shared/config/navigation';
describe('navigation configuration',()=>{
 it('has unique routes and labels',()=>{expect(new Set(navigationItems.map(x=>x.path)).size).toBe(navigationItems.length);expect(new Set(navigationItems.map(x=>x.label)).size).toBe(navigationItems.length);});
 it('includes study, revision, backup and admissions destinations',()=>{expect(navigationItems.map(x=>x.path)).toEqual(expect.arrayContaining(['/','/subjects','/test-series','/quizzes','/pyqs','/notes','/mistake-library','/abstractions','/cheat-sheets','/statistics','/history','/backup','/others/counseling','/others/keep-track','/others/reminders','/others/eligible-courses']));});
 it('uses absolute router paths',()=>expect(navigationItems.every(x=>x.path.startsWith('/'))).toBe(true));
});
