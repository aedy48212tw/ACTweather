import {readFile,writeFile} from 'node:fs/promises';
const metadata={repositoryName:process.env.ACT_REPOSITORY,commitSha:process.env.ACT_COMMIT,repositoryOwner:process.env.ACT_OWNER};
if(Object.values(metadata).some(v=>!v))throw Error('Missing GitHub repository metadata');
const packageJSON=JSON.parse(await readFile('package.json','utf8'));
const config=JSON.parse(await readFile('dist/plugin.json','utf8'));
if(config.name!==packageJSON.name||config.version!==packageJSON.version)throw Error('Plugin/package name or version mismatch');
if(config.private!==false)throw Error('Public release must use private:false');
await writeFile('dist/plugin.json',JSON.stringify({...config,...metadata},null,2)+'\n');
console.log('Prepared release '+config.name+' v'+config.version);
