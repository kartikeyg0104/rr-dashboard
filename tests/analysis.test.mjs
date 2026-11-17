import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pressureState,selectPlayers,reliabilityIndex,csvFor,esc,normaliseBoard,wrapSpotlight} from '../dist/lib.js';
import {createSelectionRoom} from '../dist/auction.js';
import {decorateStage,playerVault,cinemaToolbar} from '../dist/cinema.js';
import {PLAYER_PHOTOS} from '../dist/photo-data.js';
import {playerAvatar,portrait} from '../dist/photos.js';
import {calculateCardPose} from '../dist/spotlight-motion.js';
const data=JSON.parse(readFileSync(new URL('../dist/assets/data.json',import.meta.url)));
test('the verified final twenty and support cohort remain fixed',()=>{
  assert.equal(data.players.length,249);
  assert.equal(data.players.filter(p=>p.role==='bat').length,117);
  assert.equal(data.players.filter(p=>p.role==='bowl').length,132);
  assert.deepEqual(selectPlayers(data.players,{role:'bat'}).map(p=>p.id),['2984','3647','6059','4853','37052','1101','6396','4926','4986','7897']);
  assert.deepEqual(selectPlayers(data.players,{role:'bowl'}).map(p=>p.id),['7327','2933','3628','781','7364','2633','2382','39657','2876','4373']);
});
test('browser index reproduces every eligible player score',()=>{for(const p of data.players)assert.ok(Math.abs(reliabilityIndex(p.wins,p.n)-p.score)<1e-7,`${p.name} ${p.role}`);});
test('pressure boundaries, final overs and bowling perspective',()=>{
  for(const p of [.2,.65])assert.equal(pressureState(p,60).pressure,true);
  assert.equal(pressureState(.45,61).pressure,false);
  assert.equal(pressureState(.19,13).pressure,false);
  for(const p of [.1,.9])assert.equal(pressureState(p,12).pressure,true);
  assert.equal(pressureState(.91,12).pressure,false);
  assert.equal(pressureState(.75,40,'bat').pressure,false);
  assert.equal(pressureState(.75,40,'bowl').pressure,true);
});
test('search finds Kohli in full cohort without overwriting official rank',()=>{const list=selectPlayers(data.players,{role:'bat',scope:'all',query:'Kohli'});assert.equal(list.length,1);assert.equal(list[0].rank,99);assert.equal(list[0].wins,9);assert.equal(list[0].n,26);});
test('alternate sorts preserve rank and support role constraints',()=>{
  const before=JSON.stringify(data.players);for(const sort of ['sample','lift','utility']){const list=selectPlayers(data.players,{role:'bowl',scope:'all',sort});assert.equal(list.length,132);assert.ok(list.every(p=>p.role==='bowl'));}assert.equal(JSON.stringify(data.players),before);
});
test('input safety and CSV quoting',()=>{assert.equal(esc('<script>"&'), '&lt;script&gt;&quot;&amp;');assert.match(csvFor([{rank:1,name:'A, "B"',role:'bat',score:50,wins:1,n:2,exposure:3,lift:4,utility:5}]),/"A, ""B"""/);assert.throws(()=>reliabilityIndex(2,1),RangeError);});
test('review board only persists distinct final selections and tolerates invalid stored data',()=>{
  assert.deepEqual(normaliseBoard(['bat:2984','bat:47','bat:2984','bowl:2933','bat:missing'],data.players),['bat:2984','bowl:2933']);
  assert.deepEqual(normaliseBoard({invalid:true},data.players),[]);
  assert.deepEqual(normaliseBoard(null,data.players),[]);
  assert.equal(normaliseBoard(data.players.map(p=>`${p.role}:${p.id}`),data.players).length,20);
});
test('spotlight navigation wraps forward and backward without escaping the cohort',()=>{assert.equal(wrapSpotlight(9,1,10),0);assert.equal(wrapSpotlight(0,-1,10),9);assert.equal(wrapSpotlight(4,1,10),5);assert.equal(wrapSpotlight(0,1,0),0);});
test('main-card pointer motion stays centered and bounded at every edge',()=>{
  const center=calculateCardPose(100,150,200,300);assert.equal(Math.abs(center.rotateX),0);assert.equal(center.rotateY,0);assert.equal(center.shiftX,0);assert.equal(center.shiftY,0);
  const corner=calculateCardPose(200,0,200,300);assert.equal(corner.rotateX,8);assert.equal(corner.rotateY,11);assert.equal(corner.shiftX,4);assert.equal(corner.shiftY,-3);
  assert.deepEqual(calculateCardPose(1000,-1000,200,300),corner);
  const collapsed=calculateCardPose(1,1,0,0);assert.equal(Math.abs(collapsed.rotateX),0);assert.equal(collapsed.rotateY,0);
});
test('selection room renders audited evidence and labels its auction scope',()=>{
  const before=JSON.stringify(data.players),room=createSelectionRoom(data,{onInspect(){},onCompare(){},notify(){},shouldReduceMotion:()=>true});
  const html=room.render();assert.match(html,/Historical pressure rankings\. No bids, prices or claims of auction availability\./);
  assert.match(html,/Sikandar Raza/);assert.match(html,/50\.62/);assert.match(html,/18 positive pressure appearances/);
  assert.match(html,/data-room-inspect="bat:2984"/);assert.match(html,/data-card-flip/);assert.match(html,/aria-hidden="true"/);
  assert.equal(JSON.stringify(data.players),before);
});
test('every final selection has a local photograph and source credit, including Kohli for comparisons',()=>{
  const credits=JSON.parse(readFileSync(new URL('../dist/assets/image-credits.json',import.meta.url)));
  assert.equal(Object.keys(PLAYER_PHOTOS).length,21);assert.equal(credits.images.length,21);
  for(const p of data.players.filter(p=>p.rank<=10)){
    const photo=PLAYER_PHOTOS[p.id];assert.ok(photo,p.name);assert.match(photo.src,/^\.\/assets\/players\/[a-z-]+\.(png|webp)$/);
    const bytes=readFileSync(new URL('../dist/'+photo.src.slice(2),import.meta.url));assert.ok(bytes.length>4000,`${p.name} must not use a tiny placeholder`);
    const alpha=photo.src.endsWith('.png')?[4,6].includes(bytes[25])||bytes.includes(Buffer.from('tRNS')):bytes.includes(Buffer.from('ALPH'))||(bytes.toString('ascii',12,16)==='VP8X'&&Boolean(bytes[20]&16));assert.ok(alpha,`${p.name}: transparent format expected`);
    const credit=credits.images.find(c=>c.id===p.id);assert.equal(credit.src,photo.src);assert.ok(new URL(credit.profile).protocol==='https:');
  }
  assert.match(PLAYER_PHOTOS['6059'].src,/ruturaj-gaikwad/);assert.match(PLAYER_PHOTOS['47'].name,/Virat Kohli/);
  assert.ok(!playerAvatar({id:'missing',shortName:'No Photo'}).includes('<img'));
});
test('cinematic player cards and vault use the correct portraits without changing rank data',()=>{
  const markup=cinemaToolbar();for(const control of ['data-cinema-toggle','data-showreel-toggle','data-cinema-motion','data-replay-entrance'])assert.ok(markup.includes(control));
  for(const role of ['bat','bowl']){
    const vault=playerVault(data.players,role,0);assert.equal((vault.match(/class="rail-card /g)||[]).length,10);assert.equal((vault.match(/aria-pressed="true"/g)||[]).length,1);
    for(const p of data.players.filter(p=>p.role===role&&p.rank<=10)){
      const base=`<div class="auction-stage ${role}"><div class="stage-grid"></div><h2>${p.shortName}</h2><div class="spotlight-card"><div class="jersey-art" aria-hidden="true"><svg></svg></div></div></div>`;
      const rendered=decorateStage(base,p,{intro:true});assert.ok(rendered.includes(PLAYER_PHOTOS[p.id].src));assert.ok(rendered.includes('has-player-photo'));assert.ok(!rendered.includes('jersey-art'));assert.ok(rendered.includes('cinema-opening'));assert.ok(vault.includes(PLAYER_PHOTOS[p.id].src));assert.match(rendered,/role="button" tabindex="0" data-card-flip aria-pressed="false"/);assert.match(decorateStage(base,p,{flipped:true}),/data-card-flip aria-pressed="true"/);
    }
  }
  assert.equal(portrait({id:'unknown'}),'');
});
test('uncertainty values, names and evidence links are finite and complete',()=>{for(const p of data.players){for(const key of ['score','wins','n','lift','utility','betaLow','betaHigh','rankLow','rankHigh','top10Frequency'])assert.ok(Number.isFinite(p[key]),`${p.name}: ${key}`);assert.ok(p.wins<=p.n);assert.ok(p.betaLow<=p.betaHigh);assert.equal(p.scenarios.length,4);}assert.equal(data.missingFixtures.length,2);assert.ok(data.missingFixtures.every(f=>new URL(f.url).hostname==='www.icc-cricket.com'));});
