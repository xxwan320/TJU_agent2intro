import {fileURLToPath} from 'node:url';import * as nodePath from 'node:path';
const projectRoot=fileURLToPath(new URL('..',import.meta.url));
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(nodePath.join(projectRoot,'package.json')),ts=require('typescript'),THREE=require('three');
const path=nodePath.join(projectRoot,'frontend/src/scene/reconstruction-map.ts'),source=await fs.readFile(path,'utf8'),ast=ts.createSourceFile(path,source,ts.ScriptTarget.ESNext,true,ts.ScriptKind.TS);
const declaration=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='modelMapQuaternion');assert(declaration);
const javascript=ts.transpileModule(declaration.getText(ast).replace('export ',''),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
const rotation=new Function('THREE',javascript+';return modelMapQuaternion;')(THREE),samples=[];
for(const heading of [0,45,90,180,270,-90,360]){const q=rotation(heading),up=new THREE.Vector3(0,1,0).applyQuaternion(q),front=new THREE.Vector3(0,0,1).applyQuaternion(q),rad=heading*Math.PI/180;assert(up.distanceTo(new THREE.Vector3(0,0,1))<1e-9);assert(front.distanceTo(new THREE.Vector3(Math.sin(rad),Math.cos(rad),0))<1e-9);samples.push({heading,up:up.toArray(),front:front.toArray(),quaternion:q.toArray()});}
const out=nodePath.join(projectRoot,'docs/diagnostics/3d-agent-completion/20260926-strict/ui/map-rotation.json');await fs.writeFile(out,JSON.stringify({status:'PASS_OFFLINE',scope:'Pure rotation function extracted from actual production TypeScript. North/east axes confirmed separately using real AMap customCoords.',samples},null,2));console.log(JSON.stringify({status:'PASS',headings:samples.length}));
