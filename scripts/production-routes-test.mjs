import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const manifest=JSON.parse(await readFile(".next/prerender-manifest.json","utf8"));
const base=process.env.TERRAWAVE_URL||"http://127.0.0.1:3001";
const routes=[...new Set([...Object.keys(manifest.routes).filter(route=>!["/_not-found","/_global-error"].includes(route)),"/think","/icon.svg"])];
let count=0;
// Bound concurrent requests so this checks the server rather than flooding it.
for(let offset=0;offset<routes.length;offset+=4){
  await Promise.all(routes.slice(offset,offset+4).map(async route=>{
    const response=await fetch(base+route,{signal:AbortSignal.timeout(60000)});
    assert.equal(response.status,200,route);
    const content=await response.text();
    assert.ok(content.length>0,route+" has content");
    assert.ok(!content.includes("Application error: a server-side exception"),route);
    count++;
  }));
}
const missing=await fetch(base+"/this-route-should-not-exist");
assert.equal(missing.status,404);
assert.match(await missing.text(),/Let’s find a better direction/);
console.log(`PASS production route sweep: ${count} real routes return 200; unknown route returns branded 404.`);
