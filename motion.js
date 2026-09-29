const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader=document.createElement('div');
loader.className='motion-loader';
loader.setAttribute('aria-label','Loading Aanchal care experience');
loader.innerHTML='<img class="motion-loader-logo" src="logo.png" alt="Aanchal" /><p>Aanchal</p><span>Gathering a little warmth</span>';
document.body.append(loader);
const canvas=document.createElement('canvas');
canvas.className='motion-field';
canvas.setAttribute('aria-hidden','true');
document.body.prepend(canvas);
const context=canvas.getContext('2d');
let width=0,height=0,particles=[],pointerX=0,pointerY=0;
function resizeField(){const ratio=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=width*ratio;canvas.height=height*ratio;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.setTransform(ratio,0,0,ratio,0,0);particles=Array.from({length:Math.min(72,Math.max(38,Math.round(width/18)))},()=>({x:Math.random()*width,y:Math.random()*height,r:.4+Math.random()*1.4,s:.08+Math.random()*.22,drift:(Math.random()-.5)*.16,warm:Math.random()>.42}))}
function drawField(){context.clearRect(0,0,width,height);particles.forEach(particle=>{particle.y-=particle.s;particle.x+=particle.drift+Math.sin((particle.y+pointerX)*.008)*.08;if(particle.y<-12){particle.y=height+12;particle.x=Math.random()*width}const glow=context.createRadialGradient(particle.x,particle.y,0,particle.x,particle.y,particle.r*8);glow.addColorStop(0,particle.warm?'rgba(235,177,113,.48)':'rgba(137,153,128,.34)');glow.addColorStop(1,'rgba(235,177,113,0)');context.fillStyle=glow;context.beginPath();context.arc(particle.x,particle.y,particle.r*8,0,Math.PI*2);context.fill()});if(!reduceMotion)requestAnimationFrame(drawField)}
function updateParallax(){if(reduceMotion)return;document.querySelectorAll('.motion-parallax').forEach((element,index)=>{const rect=element.getBoundingClientRect();const speed=index%2?-0.025:0.018;const offset=(rect.top+rect.height/2-height/2)*speed;element.style.setProperty('--motion-y',`${offset}px`);element.style.setProperty('--motion-x',`${pointerX*(index%2?.004:-.003)}px`)})}
function setReveal(){document.body.classList.add('motion-ready');const elements=document.querySelectorAll('.motion-reveal');if(reduceMotion){elements.forEach(element=>element.classList.add('is-visible'));return}const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible')}),{threshold:.15,rootMargin:'0px 0px -8%'});elements.forEach(element=>observer.observe(element))}
addEventListener('resize',()=>{resizeField();updateParallax()});addEventListener('scroll',updateParallax,{passive:true});addEventListener('pointermove',event=>{pointerX=event.clientX-width/2;pointerY=event.clientY-height/2;document.documentElement.style.setProperty('--pointer-x',`${pointerX}px`);document.documentElement.style.setProperty('--pointer-y',`${pointerY}px`);updateParallax()},{passive:true});
const revealSelectors='.hero-copy,.hero-portrait,.intro-copy,.chapter-guide,.section-heading,.care-image,.care-copy,.closing,.catalog-intro,.catalog-grid,.package-hero,.package-products,.account-welcome,.account-card';document.querySelectorAll(revealSelectors).forEach(element=>{element.classList.add('motion-reveal');if(element.matches('.hero-copy,.hero-portrait,.chapter-guide,.catalog-intro,.package-hero,.account-welcome'))element.classList.add('motion-parallax')});
resizeField();setReveal();drawField();
addEventListener('load',()=>setTimeout(()=>loader.classList.add('is-hidden'),reduceMotion?80:900));
