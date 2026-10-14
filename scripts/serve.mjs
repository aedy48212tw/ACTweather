import https from 'node:https';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=new Map([['/plugin.js','plugin.js'],['/plugin.min.js','plugin.min.js'],['/plugin.json','plugin.json'],['/screenshot.jpg','screenshot.jpg']]);
const server=https.createServer({key:fs.readFileSync(path.join(base,'scripts/certs/localhost-key.pem')),cert:fs.readFileSync(path.join(base,'scripts/certs/localhost-cert.pem'))},(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 const file=files.get(new URL(req.url,'https://localhost').pathname);
 if(!file){res.writeHead(404);res.end('Not found');return;}
 try{const bytes=fs.readFileSync(path.join(base,'dist',file));res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript; charset=utf-8':file.endsWith('.json')?'application/json':'image/jpeg');res.end(bytes);}catch{res.writeHead(404);res.end('Build file missing');}
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port 9999 is in use. Close the previous ACTweather window.':e.message);process.exitCode=1;});
server.listen(9999,'127.0.0.1',()=>console.log('ACTweather test server: https://localhost:9999/plugin.js\nOpen https://www.windy.com/developer-mode and load this URL.\nKeep this terminal open; Ctrl+C stops the server.'));
