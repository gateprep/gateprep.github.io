import {afterEach,describe,expect,it} from 'vitest';
import {defaultCatalog,flattenNodes,readTaxonomy,saveTaxonomy,validateTaxonomy,type TaxonomyNode} from '../src/features/learning/taxonomy';

afterEach(()=>localStorage.clear());

describe('course taxonomy',()=>{
  it('flattens arbitrary-depth nodes into stable full paths',()=>{
    const nodes:TaxonomyNode[]=[{id:'graph',name:'Graph Algorithms',children:[{id:'mst',name:'Minimum Spanning Tree',children:[{id:'kruskal',name:'Kruskal',children:[]}]}]}];
    expect(flattenNodes(nodes)).toEqual(['Graph Algorithms','Graph Algorithms / Minimum Spanning Tree','Graph Algorithms / Minimum Spanning Tree / Kruskal']);
  });
  it('validates and persists multiple independent courses',()=>{
    const catalog=defaultCatalog();
    const second={id:'gate-da',name:'GATE Data Science',paper:'DA',nodes:[{id:'stats',name:'Statistics',children:[{id:'prob',name:'Probability',children:[]}]}]};
    const next=validateTaxonomy({...catalog,courses:[...catalog.courses,second],activeCourseId:'gate-da'});
    saveTaxonomy(next);
    expect(readTaxonomy().activeCourseId).toBe('gate-da');
    expect(readTaxonomy().courses).toHaveLength(2);
    expect(flattenNodes(readTaxonomy().courses[1].nodes[0].children)).toEqual(['Probability']);
  });
  it('rejects malformed nested nodes rather than partially importing them',()=>{
    expect(()=>validateTaxonomy({id:'broken',name:'Broken',nodes:[{id:'x',name:'X'}]})).toThrow('valid nested nodes array');
  });
});
