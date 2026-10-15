import fs from 'node:fs';
const text=fs.readFileSync('publish-response.txt','utf8');
const decoded=text.replace(/\\\//g,'/'),urls=[...new Set(decoded.match(/https:\/\/windy-plugins\.com\/[^\s"'<>]+\/plugin\.min\.js/g)??[])];
const summary='## ACTweather publishing result\n\n'+(urls.length?urls.map(url=>`- [Install plugin](${url})`).join('\n'):'Upload succeeded. See the Publish Plugin log for the official installation URL.')+'\n\nUploading is separate from Windy public-list approval.\n';
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary);
console.log(summary);
