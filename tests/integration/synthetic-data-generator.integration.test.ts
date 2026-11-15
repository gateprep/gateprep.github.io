import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {beforeAll,describe,expect,it} from 'vitest';
const root=process.cwd(),out=path.join(root,'synthetic-data');
function untar(gz){const raw=zlib.gunzipSync(gz),files=new Map();let off=0;while(off+512<=raw.length){const h=raw.subarray(off,off+512);if(h.every(x=>x===0))break;const name=h.subarray(0,100).toString().replace(/\0.*$/s,''),size=parseInt(h.subarray(124,136).toString().replace(/\0.*$/s,'').trim(),8)||0,start=off+512;files.set(name,raw.subarray(start,start+size));off=start+512+Math.ceil(size/512)*512;}return files;}
function unzip(buffer){const files=new Map();let off=0;while(off+30<=buffer.length&&buffer.readUInt32LE(off)===0x04034b50){const method=buffer.readUInt16LE(off+8),compressed=buffer.readUInt32LE(off+18),nameLen=buffer.readUInt16LE(off+26),extra=buffer.readUInt16LE(off+28),name=buffer.subarray(off+30,off+30+nameLen).toString(),start=off+30+nameLen+extra,raw=buffer.subarray(start,start+compressed);files.set(name,method===8?zlib.inflateRawSync(raw):raw);off=start+compressed;}return files;}
beforeAll(()=>{execFileSync(process.execPath,[path.join(root,'scripts/generate-synthetic-data.mjs')],{cwd:root,stdio:'pipe'});});
describe('synthetic QA data generator',()=>{
 it('creates a v3 portable archive with valid inventory hashes and all app sections',()=>{
  const archive=path.join(out,'GATEPrep-Synthetic-Full-Backup.tar.gz');expect(existsSync(archive)).toBe(true);
  const files=untar(readFileSync(archive)),manifest=JSON.parse(files.get('manifest.json').toString()),data=JSON.parse(files.get('data.json').toString());
  expect(manifest).toMatchObject({format:'GATEPREP-TAR-GZ',schemaVersion:3,minimumReaderVersion:3});
  for(const item of manifest.files){const bytes=files.get(item.path);expect(bytes).toBeDefined();expect(bytes.length).toBe(item.size);expect(crypto.createHash('sha256').update(bytes).digest('hex')).toBe(item.sha256);}
  expect(data.learning.questions).toHaveLength(96);expect(data.learning.attempts).toHaveLength(480);
  expect(new Set(data.learning.attempts.map(x=>x.mistake).filter(Boolean))).toEqual(new Set(['Silly mistake','Conceptual mistake','Understanding mistake','Time management']));
  const assessment=JSON.parse(data.assessments),knowledge=JSON.parse(data.knowledge),admissions=JSON.parse(data.admissions);
  expect(assessment.profiles).toHaveLength(5);expect(assessment.tests).toHaveLength(3);expect(knowledge).toHaveLength(18);expect(admissions.applications).toHaveLength(2);
  expect(manifest.assets.length).toBeGreaterThan(0);expect(Object.keys(JSON.parse(data.studyTime)).length).toBeGreaterThan(60);
 });
 it('creates three valid test-series ZIPs with relative image assets and correct GATE test sizing',()=>{
  const dir=path.join(out,'test-series');
  for(const [kind,count] of [['subject',30],['mixed',30],['full',65]]){
   const files=unzip(readFileSync(path.join(dir,kind+'-synthetic-test-series.zip'))),manifest=JSON.parse(files.get('manifest.json').toString()),payload=JSON.parse(files.get(manifest.questionsFile).toString());
   expect(payload.questions).toHaveLength(count);expect(manifest.kind).toBe(kind);
   const images=payload.questions.flatMap(q=>[q.promptImage,...q.options.map(o=>o.image)].filter(x=>x&&!x.startsWith('data:')&&!x.startsWith('http')));
   for(const image of images)expect(files.has(image)).toBe(true);
   if(kind==='subject')expect(new Set(payload.questions.map(q=>q.subject))).toEqual(new Set(['Algorithms']));
   if(kind==='mixed')expect(new Set(payload.questions.map(q=>q.subject)).size).toBeGreaterThan(1);
   if(kind==='full')expect(payload.questions.reduce((n,q)=>n+q.marks,0)).toBe(100);
  }
 });
});
