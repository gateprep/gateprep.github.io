import {useEffect,useState} from 'react';

export type TaxonomyNode={id:string;name:string;children:TaxonomyNode[]};
export type Course={id:string;name:string;paper:string;nodes:TaxonomyNode[]};
export type TaxonomyCatalog={schemaVersion:1;activeCourseId:string;courses:Course[]};
const KEY='gateprep-taxonomy-v1';
const uid=()=>crypto.randomUUID();
const defaults:Record<string,string[]>={
'Engineering Mathematics':['Linear Algebra','Calculus','Probability and Statistics'],
'Discrete Mathematics':['Propositional and First-Order Logic','Sets, Relations and Functions','Partial Orders and Lattices','Monoids and Groups','Graph Theory','Combinatorics','Recurrence Relations and Generating Functions'],
'Digital Logic':['Boolean Algebra and Minimization','Karnaugh Maps','Combinational Circuits','Sequential Circuits','Number Representation','Fixed and Floating-Point Arithmetic'],
'Computer Organization & Architecture':['Instruction Set and Addressing Modes','ALU Design','Control Unit Design','Memory Interfacing','Cache and Memory Hierarchy','I/O: Interrupts and DMA','Instruction Pipelining and Hazards'],
'C Programming':['Data Types and Operators','Control Flow and Loops','Functions and Parameter Passing','Pointers and Pointer Arithmetic','Arrays and Strings','Structures, Unions and Enums','Dynamic Memory Allocation','Preprocessor and Macros','Bitwise Operations','Recursion'],
'Programming & Data Structures':['Recursion','Arrays','Stacks and Queues','Linked Lists','Trees','Binary Search Trees','Binary Heaps','Graphs'],
'Algorithms':['Searching','Sorting','Hashing','Asymptotic Time and Space Complexity','Greedy Algorithms','Dynamic Programming','Divide and Conquer','Graph Traversals','Minimum Spanning Trees','Shortest Paths'],
'Theory of Computation':['Regular Expressions and Finite Automata','Context-Free Grammars','Pushdown Automata','Regular and Context-Free Languages','Pumping Lemma','Turing Machines','Undecidability'],
'Compiler Design':['Lexical Analysis','Parsing','Syntax-Directed Translation','Runtime Environments','Intermediate Code Generation','Local Optimisation','Constant Propagation','Liveness Analysis','Common Subexpression Elimination'],
'Operating Systems':['System Calls','Processes and Threads','Inter-Process Communication','Concurrency and Synchronization','Deadlocks','CPU and I/O Scheduling','Memory Management','Virtual Memory','File Systems'],
'Databases':['ER Model','Relational Model','Relational Algebra','Tuple Calculus','SQL','Integrity Constraints','Normal Forms','File Organisation','Indexing: B and B+ Trees','Transactions and Concurrency Control'],
'Computer Networks':['Layering Principles','Packet, Circuit and Virtual-Circuit Switching','Network Performance Metrics','Data Link Layer and Error Detection','Medium Access Control','Ethernet','Routing Protocols','IP Addressing and Fragmentation','Transport Layer: TCP and UDP','Flow and Congestion Control','Socket API','DNS and HTTP']
};
const makeNode=(name:string):TaxonomyNode=>({id:uid(),name,children:[]});
const defaultCourse:Course={id:'gate-cse-2027',name:'GATE CSE 2027',paper:'CS',nodes:Object.entries(defaults).map(([name,children])=>({id:uid(),name,children:children.map(makeNode)}))};
const validNode=(n:any):n is TaxonomyNode=>!!n&&typeof n.id==='string'&&typeof n.name==='string'&&n.name.trim().length>0&&Array.isArray(n.children)&&n.children.every(validNode);
export function defaultCatalog():TaxonomyCatalog{return {schemaVersion:1,activeCourseId:defaultCourse.id,courses:[defaultCourse]};}
export function readTaxonomy():TaxonomyCatalog{try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x?.schemaVersion===1&&Array.isArray(x.courses)&&x.courses.length&&x.courses.every((c:any)=>c&&typeof c.id==='string'&&typeof c.name==='string'&&Array.isArray(c.nodes)&&c.nodes.every(validNode))){return {...x,activeCourseId:x.courses.some((c:any)=>c.id===x.activeCourseId)?x.activeCourseId:x.courses[0].id};}}catch{}return defaultCatalog();}
export function saveTaxonomy(value:TaxonomyCatalog){localStorage.setItem(KEY,JSON.stringify(value));window.dispatchEvent(new Event('gateprep-taxonomy-updated'));}
export function flattenNodes(nodes:TaxonomyNode[],prefix=''):string[]{return nodes.flatMap(n=>{const path=prefix?prefix+' / '+n.name:n.name;return [path,...flattenNodes(n.children,path)];});}
export function getCourse(catalog:TaxonomyCatalog){return catalog.courses.find(c=>c.id===catalog.activeCourseId)||catalog.courses[0]||defaultCourse;}
export function useTaxonomy(){const [catalog,setCatalog]=useState<TaxonomyCatalog>(()=>readTaxonomy());useEffect(()=>{const update=()=>setCatalog(readTaxonomy());window.addEventListener('gateprep-taxonomy-updated',update);return()=>window.removeEventListener('gateprep-taxonomy-updated',update);},[]);const course=getCourse(catalog);const subjects=course.nodes.map(n=>n.name);const topics:Record<string,string[]>={};for(const n of course.nodes)topics[n.name]=flattenNodes(n.children);return {catalog,course,subjects,topics};}
export function validateTaxonomy(value:any):TaxonomyCatalog{const catalog=value?.schemaVersion===1?value:{schemaVersion:1,activeCourseId:value?.id,courses:[value]};if(!Array.isArray(catalog.courses)||!catalog.courses.length)throw new Error('JSON must contain at least one course.');for(const c of catalog.courses){if(!c||typeof c.name!=='string'||!c.name.trim()||!Array.isArray(c.nodes)||!c.nodes.every(validNode))throw new Error('Each course needs a name and a valid nested nodes array.');}return {schemaVersion:1,activeCourseId:catalog.activeCourseId||catalog.courses[0].id,courses:catalog.courses};}
