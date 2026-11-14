import {describe,expect,it,vi} from 'vitest';
import {verifyBackupInventory} from '../../src/features/learning/backupLogic';
describe('backup integrity unit logic',()=>{
 it('accepts a complete inventory with matching sizes and hashes',async()=>{
  const files=new Map([['data.json',new TextEncoder().encode('{}')]]);
  await expect(verifyBackupInventory([{path:'data.json',size:2,sha256:'abc'}],files,async()=> 'abc')).resolves.toBe(true);
 });
 it('rejects missing, truncated and checksum-mismatched files',async()=>{
  const bytes=new TextEncoder().encode('{}'),files=new Map([['data.json',bytes]]);
  await expect(verifyBackupInventory([{path:'missing',size:2,sha256:'abc'}],files,async()=> 'abc')).rejects.toThrow(/integrity/);
  await expect(verifyBackupInventory([{path:'data.json',size:3,sha256:'abc'}],files,async()=> 'abc')).rejects.toThrow(/integrity/);
  await expect(verifyBackupInventory([{path:'data.json',size:2,sha256:'abc'}],files,async()=> 'bad')).rejects.toThrow(/integrity/);
 });
 it('rejects an absent or empty manifest inventory',async()=>{
  await expect(verifyBackupInventory([],new Map())).rejects.toThrow(/inventory/);
  await expect(verifyBackupInventory(null as any,new Map())).rejects.toThrow(/inventory/);
 });
});
