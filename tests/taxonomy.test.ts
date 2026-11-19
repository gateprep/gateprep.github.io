import {afterEach,describe,expect,it} from 'vitest';
import {defaultCatalog,findNodeId,mergeTaxonomyCatalog,findNodeLocation,flattenNodes,readTaxonomy,saveTaxonomy,validateTaxonomy,type TaxonomyNode} from '../src/features/learning/taxonomy';

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
  it('merges imported courses without removing unrelated courses',()=>{
    const current=defaultCatalog();
    const imported=validateTaxonomy({id:'gate-da',name:'GATE Data Science',paper:'DA',nodes:[]});
    const merged=mergeTaxonomyCatalog(current,imported);
    expect(merged.courses.map(c=>c.id)).toEqual(['gate-cse-2027','gate-da']);
    expect(merged.activeCourseId).toBe('gate-da');
  });
  it('keeps question and note references stable when a node is renamed',()=>{
    const catalog=defaultCatalog();
    const algorithms=catalog.courses[0].nodes.find(n=>n.name==='Algorithms')!;
    const node=algorithms.children[0];
    const id=findNodeId(catalog,catalog.courses[0].id,'Algorithms',node.name);
    node.name='Search & Retrieval';
    expect(findNodeLocation(catalog,catalog.courses[0].id,id)).toEqual({subject:'Algorithms',topic:'Search & Retrieval'});
  });
  it('rejects malformed nested nodes rather than partially importing them',()=>{
    expect(()=>validateTaxonomy({id:'broken',name:'Broken',nodes:[{id:'x',name:'X'}]})).toThrow('valid nested nodes array');
  });
});
