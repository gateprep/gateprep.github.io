export type KnowledgeRevision={at:string;body:string;title:string};
export function buildKnowledgeRevision(existing:KnowledgeRevision[],oldBody:string,oldTitle:string,newBody:string,at:string){return oldBody!==newBody?[{at,body:oldBody,title:oldTitle},...existing].slice(0,100):existing;}
export function canSaveKnowledgeTitle(title:string){return Boolean(title.trim());}
