"use strict";
/* Livro 0 — EduLegal. Somente demonstração com dados fictícios.
   Sem Supabase, IA, ranking, pontos, chat ou análise de perfil. */
(function(){
 const STORAGE_KEY="edulegal-testes-ponto-de-partida-v1";
 const THEME_KEY="edulegal-interface-theme";
 const AREA_INFO={
  roblox:{title:"Meu Primeiro Obby",area:"Roblox Studio",available:false,preview:[
   "Conhecer a área de trabalho, o Explorer e a janela Propriedades",
   "Construir uma plataforma com uma Part e testar Anchored",
   "Criar e testar um pequeno percurso de obstáculos",
   "Explorar Transparency e CanCollide",
   "Escrever um Script em pequenas etapas"
  ]},
  robotica:{title:"Minha Primeira Luz",area:"Robótica e Arduino",available:false,preview:[
   "Conhecer um LED e o que ele faz",
   "Reconhecer um circuito simples e seguro",
   "Descobrir como acender e apagar uma luz com programação"
  ]},
  escrita:{title:"Minha Primeira História",area:"Escrita criativa",available:false,preview:[
   "Inventar um personagem",
   "Escolher um lugar para a aventura",
   "Criar um acontecimento inesperado"
  ]},
  web:{title:"Minha Primeira Página",area:"Sites e programação",available:false,preview:[
   "Conhecer uma página HTML","Criar um título e um pequeno texto","Mudar a aparência com CSS"
  ]},
  pico8:{title:"Meu Primeiro Jogo 2D",area:"Jogos 2D",available:false,preview:[
   "Conhecer os personagens e o cenário de um jogo","Planejar um desafio simples","Experimentar movimentar um personagem no PICO-8"
  ]},
  video:{title:"Minha Primeira Animação",area:"Vídeo e animação",available:false,preview:[
   "Escolher uma ideia para animar","Organizar duas ou três cenas","Experimentar uma sequência em movimento"
  ]}
 };
 const $=id=>document.getElementById(id);
 const isArea=x=>Object.prototype.hasOwnProperty.call(AREA_INFO,x);
 function defaultData(){return {
  version:1,interests:[],experiments:{
   roblox:{fixed:false,actions:[],hintUsed:false},
   robotica:{actions:[],hintUsed:false},
   escrita:{created:false,hero:"",place:"",twist:"",hintUsed:false}
  },choice:null,priorExperience:null,reflection:"",completedAt:null,plan:{today:[],later:[]}
 };}
 function safeLoad(){
  const initial=defaultData();
  try{
   const raw=sessionStorage.getItem(STORAGE_KEY);
   if(!raw)return initial;
   const o=JSON.parse(raw);
   if(o?.version!==1||!o?.experiments)return initial;
   if(Array.isArray(o.interests))initial.interests=o.interests.filter(x=>["roblox","robotica","escrita","web","pico8","video"].includes(x));
   for(const k of ["roblox","robotica"]){
    if(Array.isArray(o.experiments[k]?.actions))initial.experiments[k].actions=o.experiments[k].actions.filter(x=>typeof x==="string").slice(-40);
    initial.experiments[k].hintUsed=o.experiments[k]?.hintUsed===true;
   }
   initial.experiments.roblox.fixed=o.experiments.roblox?.fixed===true;
   const es=o.experiments.escrita||{};
   initial.experiments.escrita.created=es.created===true;
   for(const k of ["hero","place","twist"]){if(typeof es[k]==="string")initial.experiments.escrita[k]=es[k].slice(0,100);}
   initial.experiments.escrita.hintUsed=es.hintUsed===true;
   initial.choice=isArea(o.choice)?o.choice:null;
   initial.priorExperience=["nunca","pecas","scripts"].includes(o.priorExperience)?o.priorExperience:null;
   initial.reflection=typeof o.reflection==="string"?o.reflection.slice(0,400):"";
   initial.completedAt=typeof o.completedAt==="string"?o.completedAt:null;
   if(o.plan&&Array.isArray(o.plan.today)&&Array.isArray(o.plan.later)){
     for(const k of ["today","later"])initial.plan[k]=o.plan[k].filter(x=>typeof x==="string").slice(0,8);
   }
  }catch(_){}
  return initial;
 }
 let state=safeLoad();
 let step=0;
 let currentLab="roblox";
 let blinking=false;
 function persist(){
  try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
  catch(_){$("finishFeedback").textContent="O navegador não permitiu guardar suas escolhas nesta aba. Você ainda pode explorar o livro.";}
 }
 function themeSet(t){
  const target=t==="light"?"light":"dark";
  document.body.dataset.theme=target;
  $("themeToggle").textContent=target==="dark"?"☀ Tema claro":"☾ Tema escuro";
  try{localStorage.setItem(THEME_KEY,target);}catch(_){}
 }
 try{themeSet(localStorage.getItem(THEME_KEY));}catch(_){themeSet("dark");}
 $("themeToggle").addEventListener("click",()=>themeSet(document.body.dataset.theme==="dark"?"light":"dark"));
 function showStep(next){
  if(next<0||next>4)return;
  if(next===4&&!state.choice){next=3;$("pathFeedback").textContent="Escolha um projeto para ver os próximos passos. É só uma primeira ideia: você poderá mudar depois.";}
  step=next;
  document.querySelectorAll("[data-screen]").forEach(s=>s.hidden=Number(s.dataset.screen)!==step);
  document.querySelectorAll("[data-step]").forEach(b=>{
   const active=Number(b.dataset.step)===step;
   b.classList.toggle("active",active);
   if(active)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current");
  });
  $("chapterLabel").textContent="CAPÍTULO "+String(step+1)+" DE 5";
  if(step===4)renderPreview();
  if(step===3)renderPaths();
  document.getElementById("conteudo").focus({preventScroll:true});
  window.scrollTo({top:0,behavior:"auto"});
 }
 document.querySelectorAll("[data-step]").forEach(b=>b.addEventListener("click",()=>showStep(Number(b.dataset.step))));
 document.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>showStep(step+1)));
 document.querySelectorAll("[data-prev]").forEach(b=>b.addEventListener("click",()=>showStep(step-1)));
 // Interesses são preferências declaradas, não classificações de estilo ou competência.
 function renderInterests(){
  document.querySelectorAll("[data-interest]").forEach(b=>{
   const yes=state.interests.includes(b.dataset.interest);
   b.setAttribute("aria-pressed",String(yes));
   b.querySelector(".interest-mark").textContent=yes?"Quero explorar ✓":"Explorar área +";
  });
 }
 document.querySelectorAll("[data-interest]").forEach(b=>b.addEventListener("click",()=>{
  const k=b.dataset.interest;
  state.interests=state.interests.includes(k)?state.interests.filter(a=>a!==k):state.interests.concat(k);
  persist();renderInterests();
 }));
 function switchLab(name){
  if(!["roblox","robotica","escrita"].includes(name))return;
  currentLab=name;
  document.querySelectorAll("[data-lab]").forEach(b=>{
   const active=b.dataset.lab===name;
   b.classList.toggle("selected",active);
   b.setAttribute("aria-pressed",String(active));
  });
  document.querySelectorAll("[data-lab-panel]").forEach(p=>p.hidden=p.dataset.labPanel!==name);
 }
 document.querySelectorAll("[data-lab]").forEach(b=>b.addEventListener("click",()=>switchLab(b.dataset.lab)));
 // Experiência 1: simulação do efeito de Anchored, não do Studio real.
 function showCube(){
  const fixed=state.experiments.roblox.fixed;
  $("simCube").classList.toggle("fallen",!fixed);
  $("blockLabel").textContent=fixed?"Anchored ligado: bloco fixo":"Anchored desligado: bloco solto";
 }
 function cubeChange(fixed){
  state.experiments.roblox.fixed=fixed;
  state.experiments.roblox.actions.push(fixed?"fixar":"soltar");
  state.experiments.roblox.actions=state.experiments.roblox.actions.slice(-40);
  showCube();
  $("blockFeedback").textContent=fixed?"Você fixou o bloco! Ele fica na posição escolhida.":"Você soltou o bloco! Nesta simulação, ele desce até o chão.";
  persist();
 }
 $("fixCube").onclick=()=>cubeChange(true);
 $("releaseCube").onclick=()=>cubeChange(false);
 // Experiência 2: simulação virtual de LED.
 function setLed(on){
  $("virtualLed").classList.toggle("on",on);
  $("virtualLed").setAttribute("aria-label","LED virtual "+(on?"aceso":"apagado"));
  $("ledState").textContent=on?"LED aceso":"LED desligado";
 }
 function ledAction(action){
  state.experiments.robotica.actions.push(action);
  state.experiments.robotica.actions=state.experiments.robotica.actions.slice(-40);
  persist();
 }
 $("ledOn").onclick=()=>{if(blinking)return;setLed(true);ledAction("acender");$("ledFeedback").textContent="Você acendeu o LED virtual."};
 $("ledOff").onclick=()=>{if(blinking)return;setLed(false);ledAction("apagar");$("ledFeedback").textContent="Você apagou o LED virtual."};
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 $("ledBlink").onclick=async()=>{
  if(blinking)return;
  blinking=true;
  ["ledOn","ledOff","ledBlink"].forEach(id=>$(id).disabled=true);
  ledAction("piscar_duas_vezes");
  $("ledFeedback").textContent="Observe: acender e apagar são comandos que podemos repetir.";
  for(let i=0;i<2;i++){setLed(true);await pause(650);setLed(false);await pause(650);}
  ["ledOn","ledOff","ledBlink"].forEach(id=>$(id).disabled=false);
  blinking=false;
  $("ledFeedback").textContent="Você viu duas piscadas! O que aconteceria se repetíssemos isso mais vezes?";
 };
 // Experiência 3: combinações; não classifica a criatividade nem a escrita.
 function renderStory(){
  const e=state.experiments.escrita;
  if(e.created&&e.hero&&e.place&&e.twist){
   $("storyResult").textContent="Era uma vez "+e.hero+" que explorava "+e.place+". De repente, "+e.twist+". O que aconteceu depois? Você decide!";
  }
 }
 $("makeStory").onclick=()=>{
  const hero=$("storyHero").value,place=$("storyPlace").value,twist=$("storyTwist").value;
  if(!hero||!place||!twist){$("storyResult").textContent="Escolha um personagem, um lugar e uma surpresa. Depois vamos combinar suas ideias!";return;}
  Object.assign(state.experiments.escrita,{created:true,hero,place,twist});
  renderStory();persist();
 };
 for(const [id,key] of [["blockHint","roblox"],["ledHint","robotica"],["storyHint","escrita"]]){
  $(id).addEventListener("toggle",()=>{if($(id).open){state.experiments[key].hintUsed=true;persist();}});
 }
 // Escolher percurso: próximo livro deve existir e ser validado antes de ser anunciado como disponível.
 function renderPaths(){
  document.querySelectorAll("[data-path]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.path===state.choice)));
  $("experienceWrap").hidden=state.choice!=="roblox";
  document.querySelectorAll("[data-experience]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.experience===state.priorExperience)));
  $("toPlan").disabled=!state.choice;
  if(state.choice){
   const info=AREA_INFO[state.choice];
   $("pathFeedback").textContent="Você escolheu "+info.area+". Vamos preparar algumas tarefas iniciais.";
  }
 }
 document.querySelectorAll("[data-path]").forEach(b=>b.addEventListener("click",()=>{
  state.choice=b.dataset.path;
  // Escolher algo novo não apaga as experiências anteriores.
  state.completedAt=null;
  persist();renderPaths();
 }));
 document.querySelectorAll("[data-experience]").forEach(b=>b.addEventListener("click",()=>{
  state.priorExperience=b.dataset.experience;persist();renderPaths();
 }));
 $("toPlan").onclick=()=>showStep(4);
 // Plano sugerido para o dashboard: o aluno poderá alterar o que fará hoje.
 function renderPreview(){
  const info=AREA_INFO[state.choice];
  if(!info)return;
  $("chosenPathIntro").textContent="Você escolheu "+info.area+". Uma possibilidade de projeto: "+info.title+".";
  $("taskPreview").replaceChildren();
  for(const item of info.preview.slice(0,3)){
   const li=document.createElement("li");li.textContent=item;$("taskPreview").appendChild(li);
  }
  $("myDiscovery").value=state.reflection;
  $("finishFeedback").textContent=info.available?"Você poderá abrir seu próximo livro a partir do dashboard.":"Este percurso é uma proposta. O livro específico ainda está em desenvolvimento; as primeiras tarefas já podem aparecer no seu planejamento de demonstração.";
 }
 function makePlan(){
  const info=AREA_INFO[state.choice];
  if(!info)return {today:[],later:[]};
  // No começo, apenas duas sugestões no dia; o aluno poderá mudar no dashboard.
  const ids=info.preview.map((_,index)=>state.choice+"-"+String(index+1));
  return {today:ids.slice(0,2),later:ids.slice(2)};
 }
 $("finish").onclick=()=>{
  if(!state.choice){showStep(3);return;}
  state.reflection=$("myDiscovery").value.trim().slice(0,400);
  state.plan=makePlan();
  state.completedAt=new Date().toISOString();
  persist();
  const toast=$("doneToast");toast.hidden=false;
  $("goDashboard").focus();
 };
 $("closeToast").onclick=()=>{$("doneToast").hidden=true;};
 $("myDiscovery").addEventListener("change",()=>{
  state.reflection=$("myDiscovery").value.slice(0,400);persist();
 });
 // Retomar o livro de forma estável; nunca alterar inesperadamente o conteúdo.
 renderInterests();
 renderPaths();
 showCube();
 setLed(false);
 for(const [key,id] of [["hero","storyHero"],["place","storyPlace"],["twist","storyTwist"]]){
  const select=$(id),v=state.experiments.escrita[key];
  if(Array.from(select.options).some(o=>o.value===v))select.value=v;
 }
 renderStory();
 showStep(0);
})();
