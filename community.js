/* Acer Atlas Community v10.8.20 — authenticated photo gallery */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 let storage=null, db=null, imageUrls=[];
 const seasonNames={spring:'Lente',summer:'Zomer',autumn:'Herfst',winter:'Winter',unknown:'Onbekend'};
 const user=()=>window.acerAuth?.currentUser;
 const verified=()=>!!(user()&&user().emailVerified);
 const say=(message,error=false)=>{const el=$('communityShareStatus');if(el){el.textContent=message;el.style.color=error?'#9a4637':'';}};
 const photoChoices=plant=>{
  const out=[];
  (Array.isArray(plant?.specimens)?plant.specimens:[]).forEach((sp,si)=>{
   (Array.isArray(sp.photos)?sp.photos:[]).forEach((src,pi)=>{if(typeof src==='string'&&src.startsWith('data:image/'))out.push({src,label:(sp.name||('Exemplaar '+(si+1)))+' · Foto '+(pi+1)});});
  });
  if(!out.length){const src=plant?.coverPhoto||plant?.photo||(Array.isArray(plant?.photos)?plant.photos.find(x=>typeof x==='string'&&x.startsWith('data:image/')):'');if(typeof src==='string'&&src.startsWith('data:image/'))out.push({src,label:'Hoofdfoto'});}
  return out;
 };
 function initSelectors(){
  const plantSelect=$('communityPlant'),photoSelect=$('communityPhoto');
  if(!plantSelect||!photoSelect)return;
  const previous=plantSelect.value;
  const plants=(Array.isArray(window.collection)?window.collection:[]).filter(p=>photoChoices(p).length);
  plantSelect.innerHTML='<option value="">Kies een cultivar</option>'+plants.map(p=>'<option value="'+esc(String(p.id))+'">'+esc(p.name||p.cultivarName||p.cultivar||'Acer')+'</option>').join('');
  if(plants.some(p=>String(p.id)===previous))plantSelect.value=previous;
  fillPhotoSelect();
 }
 function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function fillPhotoSelect(){
  const plant=(window.collection||[]).find(p=>String(p.id)===$('communityPlant')?.value);
  const choices=photoChoices(plant),sel=$('communityPhoto');
  if(!sel)return;
  sel.innerHTML=choices.length?choices.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join(''):'<option value="">Geen lokaal beschikbare foto gevonden</option>';
 }
 async function sharePhoto(e){
  e.preventDefault();
  if(!verified()){say('Log in met een bevestigd account om een foto te delen.',true);return;}
  const plant=(window.collection||[]).find(p=>String(p.id)===$('communityPlant')?.value);
  const choices=photoChoices(plant),choice=choices[Number($('communityPhoto')?.value)];
  if(!plant||!choice){say('Kies een cultivar en een beschikbare foto.',true);return;}
  const button=$('communityShareButton');button.disabled=true;say('Foto wordt veilig geüpload…');
  let path='';
  try{
   const photoId=(crypto.randomUUID?crypto.randomUUID():('photo-'+Date.now()+'-'+Math.random().toString(36).slice(2)));
   const uid=user().uid;path='community/'+uid+'/'+photoId;
   const comma=choice.src.indexOf(',');const mime=(choice.src.slice(5,choice.src.indexOf(';'))||'image/jpeg').toLowerCase();
   if(comma<0||!mime.startsWith('image/'))throw new Error('Ongeldige foto.');
   const raw=atob(choice.src.slice(comma+1));if(raw.length>8*1024*1024)throw new Error('De foto is groter dan 8 MB.');
   const ref=storage.ref(path);await ref.putString(choice.src,'data_url',{contentType:mime});
   await db.collection('communityPhotos').doc(photoId).set({
    ownerUid:uid,ownerLabel:user().displayName||'Acer Atlas gebruiker',
    cultivar:String(plant.name||plant.cultivarName||plant.cultivar||'Acer').slice(0,120),
    season:$('communitySeason').value||'unknown',
    caption:String($('communityCaption').value||'').trim().slice(0,240),
    storagePath:path,createdAt:firebase.firestore.FieldValue.serverTimestamp()
   });
   $('communityCaption').value='';say('Je foto staat in de Community.');await render();
  }catch(err){
   if(path){try{await storage.ref(path).delete()}catch(_){}}
   console.error('Acer Atlas Community share failed',err);say('Delen is niet gelukt: '+(err.message||'onbekende fout'),true);
  }finally{button.disabled=false;}
 }
 async function render(){
  const host=$('communityGallery');if(!host)return;
  if(!verified()){host.innerHTML='<div class="empty">Log in om de Community te bekijken.</div>';return;}
  if(!db||!storage){host.innerHTML='<div class="empty">Community-opslag is niet beschikbaar. Vernieuw de app.</div>';return;}
  host.innerHTML='<div class="empty">Foto’s laden…</div>';imageUrls.forEach(URL.revokeObjectURL);imageUrls=[];
  try{
   let snap=await db.collection('communityPhotos').orderBy('createdAt','desc').limit(60).get();
   const all=snap.docs.map(d=>({id:d.id,...d.data()}));
   const names=[...new Set(all.map(x=>x.cultivar).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
   const filter=$('communityFilterCultivar'),old=filter.value;
   filter.innerHTML='<option value="all">Alle cultivars</option>'+names.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');
   if(names.includes(old))filter.value=old;
   const season=$('communityFilterSeason').value||'all';
   const items=all.filter(x=>(filter.value==='all'||x.cultivar===filter.value)&&(season==='all'||x.season===season));
   if(!items.length){host.innerHTML='<div class="empty">Nog geen gedeelde foto’s voor deze selectie. Deel als eerste een foto uit je collectie.</div>';return;}
   host.innerHTML='';
   for(const item of items){
    const card=document.createElement('article');card.className='card';
    const body=document.createElement('div');body.className='cardbody';
    const img=document.createElement('img');img.alt=item.cultivar;img.loading='lazy';img.style.cssText='width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px;background:var(--sage);';
    const title=document.createElement('h3');title.textContent=item.cultivar||'Acer';
    const meta=document.createElement('div');meta.className='sub';meta.textContent=(item.ownerLabel||'Acer Atlas gebruiker')+' · '+(seasonNames[item.season]||'Onbekend');
    const caption=document.createElement('p');caption.className='sub';caption.textContent=item.caption||'';
    const actions=document.createElement('div');actions.className='cardfoot';
    const like=document.createElement('button');like.type='button';like.className='outline';like.textContent='♡ Waarderen…';like.disabled=true;
    const remove=document.createElement('button');remove.type='button';remove.className='textbtn';remove.textContent='Verwijderen';remove.hidden=item.ownerUid!==user().uid;
    body.append(img,title,meta,caption,actions);actions.append(like,remove);card.append(body);host.append(card);
    try{
     const blob=await storage.ref(item.storagePath).getBlob();const objectUrl=URL.createObjectURL(blob);imageUrls.push(objectUrl);img.src=objectUrl;
     const likesRef=db.collection('communityPhotos').doc(item.id).collection('likes');
     const [likes,myLike]=await Promise.all([likesRef.get(),likesRef.doc(user().uid).get()]);
     like.disabled=false;like.textContent=(myLike.exists?'♥':'♡')+' '+likes.size+' waarderingen';
     like.addEventListener('click',async()=>{like.disabled=true;try{const ref=likesRef.doc(user().uid);if((await ref.get()).exists)await ref.delete();else await ref.set({uid:user().uid,createdAt:firebase.firestore.FieldValue.serverTimestamp()});await render();}catch(err){console.error(err);like.disabled=false;like.textContent='Waarderen mislukt';}});
     remove.addEventListener('click',async()=>{if(!confirm('Deze foto uit de Community verwijderen?'))return;remove.disabled=true;try{await db.collection('communityPhotos').doc(item.id).delete();try{await storage.ref(item.storagePath).delete()}catch(err){console.warn('Community photo file cleanup failed',err)}await render();}catch(err){console.error(err);remove.disabled=false;alert('Verwijderen is niet gelukt.');}});
    }catch(err){console.warn('Community image could not be loaded',item.id,err);img.alt='Foto niet beschikbaar';img.replaceWith(document.createTextNode('Foto kon niet worden geladen.'));}
   }
  }catch(err){console.error('Acer Atlas Community load failed',err);host.innerHTML='<div class="empty">De Community kon niet worden geladen. Controleer de verbinding en de Firebase-regels.</div>';}
 }
 function start(){
  if(!window.firebase||!window.acerAuth||!window.acerDb)return;
  try{storage=firebase.storage();db=window.acerDb;}catch(err){console.error(err);return;}
  $('communityPlant')?.addEventListener('change',fillPhotoSelect);
  $('communityShareForm')?.addEventListener('submit',sharePhoto);
  $('communityRefresh')?.addEventListener('click',render);
  $('communityFilterCultivar')?.addEventListener('change',render);
  $('communityFilterSeason')?.addEventListener('change',render);
  window.acerRenderCommunity=()=>{initSelectors();render();};
  window.acerAuth.onAuthStateChanged(()=>{if(document.getElementById('community')&&!document.getElementById('community').classList.contains('hidden')){initSelectors();render();}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();