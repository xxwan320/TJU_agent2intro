// Reuse existing isolated tests, redirecting only generated outputs into this run.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('.',import.meta.url)).replaceAll('\\','/');
const speech=readFileSync('tests/speech/r3.test.mjs','utf8').replaceAll('.runtime/speech-r3-tests','docs/diagnostics/20260917-150656/offline-build');
writeFileSync(dir+'speech.test.mjs',speech);
const calls=[
 ['--test','--test-name-pattern=T12|S02','tests/ui/tour.test.mjs'],
 ['--test','--test-name-pattern=late successful|real player events|manual interruption|unconfigured ASR','docs/diagnostics/20260917-150656/speech.test.mjs']
];
for(let i=0;i<calls.length;i++){
 const t=performance.now();const result=spawnSync(process.execPath,calls[i],{encoding:'utf8',windowsHide:true,timeout:45000});
 writeFileSync(dir+`offline-${i+1}.txt`,result.stdout+'\n'+result.stderr);
 writeFileSync(dir+`offline-${i+1}.json`,JSON.stringify({command:['node',...calls[i]],validation:'simulation_only',elapsed_ms:performance.now()-t,exit_code:result.status,error:result.error?.code??null,external_calls:0},null,2));
 console.log(result.stdout,result.stderr);
}
