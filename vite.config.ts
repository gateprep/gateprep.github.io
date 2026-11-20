import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
const buildId=new Date().toISOString();
export default defineConfig({
  base:'/',
  define:{'import.meta.env.VITE_APP_BUILD_ID':JSON.stringify(buildId)},
  plugins:[react(),{
    name:'emit-app-build-version',
    generateBundle(){this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version:buildId})});}
  }],
  build:{manifest:'manifest.json'}
});
