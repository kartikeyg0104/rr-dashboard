import {readdirSync,readFileSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const forbidden=/\.(csv|env|pkl|parquet|npy|npz)$/i;
function walk(path){return readdirSync(path).flatMap(name=>{const p=join(path,name);return statSync(p).isDirectory()?walk(p):[p];});}
const files=walk(dist);if(files.some(p=>forbidden.test(p)))throw Error('Raw/source files must not be deployed');
for(const name of ['index.html','styles.css','auction.css','cinema.css','photos.css','app.js','auction.js','cinema.js','photos.js','photo-data.js','spotlight-motion.js','lib.js','assets/data.json','assets/image-credits.json','assets/report.pdf','assets/manrope.ttf','assets/bebas-neue.ttf'])if(!files.includes(join(dist,name)))throw Error(`Missing required file: ${name}`);
const html=readFileSync(join(dist,'index.html'),'utf8');if(/https?:\/\//.test(html))throw Error('Unexpected third-party request in HTML');
console.log(`Static deployment verified: ${files.length} files, no original CSVs or runtime dependencies.`);
