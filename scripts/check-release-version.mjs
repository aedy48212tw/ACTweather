import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const current=JSON.parse(fs.readFileSync('package.json','utf8')).version;
let changed=process.env.GITHUB_EVENT_NAME==='workflow_dispatch';
if(!changed){let previous;try{previous=JSON.parse(execFileSync('git',['show','HEAD^:package.json'],{encoding:'utf8'})).version;}catch{previous=null;}changed=previous!==current;}
if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`publish=${changed}\n`);
console.log(`ACTweather ${current}: ${changed?'publish requested':'version unchanged; no upload'}`);
