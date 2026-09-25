import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {pathToFileURL} from 'node:url';
await build({configFile:false,logLevel:'silent',build:{outDir:'.runtime/r3-speech-test',emptyOutDir:false,minify:false,
 lib:{entry:'frontend/src/transport/r3-speech.ts',formats:['es'],fileName:()=> 'entry.js'}}});
const {connectSpeechInteraction}=await import(pathToFileURL(process.cwd()+'/.runtime/r3-speech-test/entry.js'));
test('assembly uses existing queue and never starts capture on connection',()=>{
 const controller={};let started=0;let supplied;
 const interaction={speechController:controller,bind(){},interrupt:async()=>{},start:async()=>{started++;},dispose(){}};
 const result=connectSpeechInteraction(options=>{supplied=options;return interaction;},controller);
 assert.equal(result,interaction);assert.equal(supplied.speechController,controller);
 assert.equal(supplied.automaticBargeIn,false);assert.equal(started,0);
});
test('assembly rejects and disposes a second queue or missing bind/interrupt hooks',()=>{
 for(const patch of [{speechController:{}},{bind:undefined},{interrupt:undefined}]){
  const controller={};let disposed=0;
  const interaction={speechController:controller,bind(){},interrupt:async()=>{},dispose(){disposed++;},...patch};
  assert.throws(()=>connectSpeechInteraction(()=>interaction,controller),/shared_controller_required/);
  assert.equal(disposed,1);
 }
});