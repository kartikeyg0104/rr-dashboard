export function calculateCardPose(x,y,width,height){
  const nx=Math.max(-1,Math.min(1,width>0?x/width*2-1:0));
  const ny=Math.max(-1,Math.min(1,height>0?y/height*2-1:0));
  return {rotateX:-ny*8,rotateY:nx*11,shiftX:nx*4,shiftY:ny*3,shineX:(nx+1)*50,shineY:(ny+1)*50};
}

// The main spotlight alone follows the pointer. Evidence flipping is a
// separate, deliberate action; hovering never changes the visible face.
export function mountSpotlightMotion(card,shouldReduceMotion){
  if(!card||shouldReduceMotion()||!matchMedia('(hover: hover) and (pointer: fine)').matches)return ()=>{};
  let bounds,frame=0,latest;
  const clear=()=>{if(frame)cancelAnimationFrame(frame);frame=0;latest=null;bounds=null;card.classList.remove('is-hovered');for(const [name,value] of Object.entries({'--card-rx':'0deg','--card-ry':'0deg','--card-x':'0px','--card-y':'0px','--card-scale':'1','--shine-x':'50%','--shine-y':'30%'}))card.style.setProperty(name,value);};
  const enter=e=>{if(e.pointerType==='touch'||shouldReduceMotion())return;bounds=card.getBoundingClientRect();card.classList.add('is-hovered');card.style.setProperty('--card-scale','1.025');};
  const move=e=>{
    if(e.pointerType==='touch'||shouldReduceMotion())return;
    if(!bounds)enter(e);
    if(!bounds)return;
    latest=calculateCardPose(e.clientX-bounds.left,e.clientY-bounds.top,bounds.width,bounds.height);
    if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;if(!latest||!card.isConnected)return;const p=latest;for(const [name,value] of Object.entries({'--card-rx':`${p.rotateX}deg`,'--card-ry':`${p.rotateY}deg`,'--card-x':`${p.shiftX}px`,'--card-y':`${p.shiftY}px`,'--shine-x':`${p.shineX}%`,'--shine-y':`${p.shineY}%`}))card.style.setProperty(name,value);});
  };
  card.addEventListener('pointerenter',enter);card.addEventListener('pointermove',move);card.addEventListener('pointerleave',clear);card.addEventListener('pointercancel',clear);
  return ()=>{clear();card.removeEventListener('pointerenter',enter);card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',clear);card.removeEventListener('pointercancel',clear);};
}
