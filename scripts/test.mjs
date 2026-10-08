import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
const dir=mkdtempSync(resolve('.test-runtime-'));
try {
 const db=join(dir,'test.db');writeFileSync(db,'');
 const schema=readFileSync('prisma/schema.prisma','utf8').replace('provider = "postgresql"','provider = "sqlite"').replace('provider = "prisma-client-js"',`provider = "prisma-client-js"\n  output = "${resolve('node_modules/.dropes-test-client')}"`);
 const file=join(dir,'schema.prisma');writeFileSync(file,schema);
 const env={...process.env,DATABASE_URL:`file:${db}`,TEST_DB_URL:`file:${db}`};
 let run=spawnSync(process.execPath,['node_modules/prisma/build/index.js','db','push','--schema',file],{env,stdio:'inherit'});
 if(run.status!==0)process.exitCode=run.status||1;
 else {run=spawnSync(process.execPath,['--import','tsx','--test','tests/commerce.test.mjs','tests/orders.test.mjs'],{env,stdio:'inherit'});process.exitCode=run.status??1;}
} finally {rmSync(dir,{recursive:true,force:true});}
