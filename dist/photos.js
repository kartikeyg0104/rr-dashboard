import {PLAYER_PHOTOS} from './photo-data.js';
import {esc,initials} from './lib.js';

export const portraitFor=p=>PLAYER_PHOTOS[String(p.id)]||null;
export function portrait(p,{className='',loading='lazy',decorative=true}={}){
  const image=portraitFor(p);if(!image)return '';
  return `<img class="${esc(className)}" data-player-photo src="${esc(image.src)}" alt="${decorative?'':esc(image.name)}" ${decorative?'aria-hidden="true"':''} loading="${loading==='eager'?'eager':'lazy'}" decoding="async" width="440" height="568">`;
}
export function playerAvatar(p){const image=portraitFor(p);return `<span class="player-avatar ${image?'has-photo':''}" aria-hidden="true"><span class="avatar-initials">${esc(initials(p.shortName))}</span>${image?portrait(p,{className:'avatar-photo'}):''}</span>`;}
export function imageCredits(){return `<div class="player-dialog-body"><div class="dialog-top"><div><div class="dialog-role">PHOTOGRAPHY & SOURCES</div><h2 id="dialog-title">The faces behind the numbers.</h2><p>Player photographs © their respective owners.</p></div><button class="icon-button" id="close-dialog" aria-label="Close image credits">×</button></div><p class="note">Photographs are sourced from the official profiles listed below. Uniforms reflect the source photograph, rather than a claim about current team, auction availability or Rajasthan Royals affiliation.</p><div class="photo-credit-grid">${Object.entries(PLAYER_PHOTOS).map(([id,p])=>`<a class="photo-credit-item" href="${esc(p.profile)}" target="_blank" rel="noopener noreferrer">${portrait({id},{className:'credit-portrait'})}<div><strong>${esc(p.name)}</strong><small>${esc(p.owner)}</small><span>Source profile ↗</span></div></a>`).join('')}</div></div>`;}
