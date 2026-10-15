import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';import readline from 'node:readline/promises';import {createHash} from 'node:crypto';
export function sourceFiles(root){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'SHA256SUMS.json'),'utf8'));
 for(const [name,hash] of Object.entries(manifest)){
  if(path.isAbsolute(name)||name.split(/[\\/]/).some(x=>['..','.git','node_modules'].includes(x)))throw Error('Unsafe release path: '+name);
  const file=path.join(root,name);if(fs.lstatSync(file).isSymbolicLink())throw Error('Release symlinks are not allowed');
  if(createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==hash)throw Error('Release file changed or is incomplete: '+name);
 }
 return [...Object.keys(manifest),'SHA256SUMS.json'];
}
export function prepareCopy(source,target,backup,files){
 const previous=[];for(const file of files){const dest=path.join(target,file);if(fs.existsSync(dest)){fs.mkdirSync(path.dirname(path.join(backup,file)),{recursive:true});fs.copyFileSync(dest,path.join(backup,file));previous.push(file);}}
 // Old downloadable artifacts are backed up and removed only when explicitly recognized by filename.
 for(const name of fs.readdirSync(target))if(/^ACTweather_v\d+\.\d+\.\d+_(?:plugin\.js|使用說明\.docx)$/.test(name)&&!files.includes(name)){
  fs.mkdirSync(backup,{recursive:true});fs.copyFileSync(path.join(target,name),path.join(backup,name));fs.unlinkSync(path.join(target,name));previous.push(name);
 }
 for(const file of files){const dest=path.join(target,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(source,file),dest);}
 return previous;
}
export function validRemote(url){return /^(?:https:\/\/github\.com\/|git@github\.com:)aedy48212tw\/ACTweather(?:\.git)?\/?$/i.test(url.trim());}
function run(command,args,cwd,{capture=false}={}){
 const result=spawnSync(process.platform==='win32'&&command==='npm'?'npm.cmd':command,args,{cwd,encoding:'utf8',stdio:capture?'pipe':'inherit',shell:false});
 if(result.error)throw Error(`${command}: ${result.error.message}`);if(result.status!==0)throw Error(`${command} failed (${result.status}). ${capture?result.stderr:''}`);return capture?result.stdout.trim():'';
}
export async function main(args=process.argv.slice(2)){
 const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),checkOnly=args.includes('--check');const files=sourceFiles(source),version=JSON.parse(fs.readFileSync(path.join(source,'package.json'))).version;
 if(checkOnly){console.log(`Release ${version}: ${files.length} files verified; no files copied or uploaded.`);return;}
 const rl=readline.createInterface({input:process.stdin,output:process.stdout});let target;
 try{
  const configDir=path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),'.config'),'ACTweatherUpdater'),config=path.join(configDir,'settings.json');let last='';try{last=JSON.parse(fs.readFileSync(config)).repositoryPath??'';}catch{}
  const typed=await rl.question(`ACTweather v${version}\nOriginal Git project folder${last?' ['+last+']':''}: `);target=path.resolve((typed.trim()||last).replace(/^"|"$/g,''));
  if(!typed.trim()&&!last)throw Error('Enter the original Git project folder.');if(target===source)throw Error('Run this updater from the newly extracted release; select your separate original Git folder.');
  const repoRoot=run('git',['rev-parse','--show-toplevel'],target,{capture:true});if(fs.realpathSync(repoRoot)!==fs.realpathSync(target))throw Error('Select the repository root containing package.json.');
  if(!validRemote(run('git',['remote','get-url','origin'],target,{capture:true})))throw Error('The origin must be aedy48212tw/ACTweather on GitHub.');
  if(run('git',['branch','--show-current'],target,{capture:true})!=='main')throw Error('Switch to main before updating.');
  if(run('git',['status','--porcelain'],target,{capture:true}))throw Error('The original Git folder has unsaved changes. Commit or back up your work first. No files were copied.');
  run('git',['pull','--ff-only','origin','main'],target);
  const targetVersion=JSON.parse(fs.readFileSync(path.join(target,'package.json'))).version;
  const compare=(a,b)=>{const aa=a.split('.').map(Number),bb=b.split('.').map(Number);for(let i=0;i<3;i++)if(aa[i]!==bb[i])return aa[i]-bb[i];return 0;};
  if(compare(version,targetVersion)<=0)throw Error(`Target is already v${targetVersion}. Use a newer release package.`);
  const backup=path.join(path.dirname(target),'ACTweather-backups',new Date().toISOString().replace(/[:.]/g,'-'));
  console.log(`Source: ${source}\nTarget: ${target}\nBackup: ${backup}\nVersion: ${targetVersion} -> ${version}`);
  const answer=await rl.question('Copy this release, commit, push and start the Windy publishing workflow? [Y/N]: ');
  if(answer.trim().toUpperCase()!=='Y'){console.log('Cancelled; no release files copied.');return;}
  const previous=prepareCopy(source,target,backup,files);console.log('Original files backed up. Release copied.');
  // CI tests the release before publishing. No local npm install is needed for this fast path.
  run('git',['add','--all','--',...new Set([...files,...previous].filter(x=>!x.startsWith('dist/')))],target);
  run('git',['commit','-m',`Update ACTweather to v${version}`],target);run('git',['push','origin','main'],target);
  fs.mkdirSync(configDir,{recursive:true});fs.writeFileSync(config,JSON.stringify({repositoryPath:target},null,2));
  console.log(`Pushed v${version}. GitHub Actions now builds, tests and publishes automatically.\nCheck: https://github.com/aedy48212tw/ACTweather/actions\nA successful push is NOT proof that Windy publishing succeeded. Open the successful run for the actual install URL.`);
  if(process.platform==='win32')spawnSync('cmd.exe',['/d','/c','start','', 'https://github.com/aedy48212tw/ACTweather/actions'],{stdio:'ignore'});
 }finally{rl.close();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error('\nUpdate stopped: '+error.message+'\nCheck the message before retrying. Your backup, if created, is outside the repository.');process.exitCode=1;});
