export const fmt = (n, digits = 1) => Number(n).toLocaleString('en-IN', {minimumFractionDigits: digits, maximumFractionDigits: digits});
export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const initials = name => name.split(/\s+/).map(s => s[0]).slice(0, 2).join('');
export function pressureState(pBat, ballsRemaining, role = 'bat') {
  const side = role === 'bowl' ? 1 - pBat : pBat;
  const ordinaryBand = side >= .20 - 1e-12 && side <= .65 + 1e-12 && ballsRemaining <= 60;
  const finalBand = side >= .10 - 1e-12 && side <= .90 + 1e-12 && ballsRemaining <= 12;
  return {side, pressure: ordinaryBand || finalBand, reason: finalBand ? 'Final two-over band' : ordinaryBand ? 'Late-innings contest band' : 'Outside the primary pressure mask'};
}
export function selectPlayers(players, {role='bat', query='', scope='top', sort='rank'} = {}) {
  const q = query.trim().toLowerCase();
  return players.filter(p => p.role === role && (scope !== 'top' || p.rank <= 10) && `${p.name} ${p.shortName}`.toLowerCase().includes(q)).sort((a,b) => sort === 'rank' ? a.rank-b.rank : sort === 'sample' ? b.n-a.n || a.rank-b.rank : sort === 'lift' ? b.lift-a.lift || a.rank-b.rank : b.utility-a.utility || a.rank-b.rank);
}
// For integer a,b, the beta CDF is a binomial upper tail. Log probabilities
// keep this stable without a browser dependency or a remote service.
function logFactorial(n) { let sum=0; for(let i=2;i<=n;i++)sum+=Math.log(i); return sum; }
export function betaCDF(x,a,b) {
  if(x<=0)return 0; if(x>=1)return 1;
  const n=a+b-1, logN=logFactorial(n); let sum=0;
  for(let k=a;k<=n;k++)sum+=Math.exp(logN-logFactorial(k)-logFactorial(n-k)+k*Math.log(x)+(n-k)*Math.log1p(-x));
  return Math.min(1,sum);
}
export function reliabilityIndex(w,n) {
  if(!Number.isInteger(w)||!Number.isInteger(n)||w<0||w>n||n<0)throw new RangeError('Require integer 0 ≤ wins ≤ appearances');
  let low=0, high=1;
  for(let i=0;i<44;i++){const mid=(low+high)/2; if(betaCDF(mid,w+4,n-w+4)<.1)low=mid;else high=mid;}
  return 100*(low+high)/2;
}
export function csvFor(players) {
  const fields=['rank','name','role','score','wins','n','exposure','lift','utility'];
  const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';
  return [fields.join(','),...players.map(p=>fields.map(k=>quote(p[k])).join(','))].join('\r\n');
}
export function normaliseBoard(keys, players) {
  const allowed=new Set(players.filter(p=>p.rank<=10).map(p=>`${p.role}:${p.id}`));
  return Array.isArray(keys)?[...new Set(keys.filter(k=>allowed.has(k)))].slice(0,20):[];
}
export const wrapSpotlight=(index,step,length)=>length?((index+step)%length+length)%length:0;
