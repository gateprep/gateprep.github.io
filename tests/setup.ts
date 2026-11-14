import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
class ResizeObserverMock implements ResizeObserver { observe() {} unobserve() {} disconnect() {} }
Object.defineProperty(globalThis,'ResizeObserver',{configurable:true,value:ResizeObserverMock});
Object.defineProperty(HTMLElement.prototype,'scrollTo',{configurable:true,value:vi.fn()});
Object.defineProperty(HTMLElement.prototype,'scrollIntoView',{configurable:true,value:vi.fn()});
Object.defineProperty(window,'matchMedia',{configurable:true,value:vi.fn().mockImplementation((media:string)=>({matches:false,media,onchange:null,addListener:vi.fn(),removeListener:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),dispatchEvent:vi.fn()}))});
if(!globalThis.crypto.randomUUID)Object.defineProperty(globalThis.crypto,'randomUUID',{configurable:true,value:()=> 'test-generated-id'});
afterEach(()=>{cleanup();localStorage.clear();sessionStorage.clear();vi.restoreAllMocks();});
