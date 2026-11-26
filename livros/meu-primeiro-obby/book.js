"use strict";
/* EduLegal Livro 1 — Meu Primeiro Obby.
   Protótipo isolado: sem Supabase, sem IA, sem execução de Luau, sem upload.
   Armazenamento temporário na sessão da aba; apenas dados fictícios. */
(function(){
 const KEY="edulegal-testes-obby-v1";
 const BOOK0_KEY="edulegal-testes-ponto-de-partida-v1";
 const $=id=>document.getElementById(id);
 const initial=()=>({version:1,chapter:0,mode:"guiado",codeStep:0,code:"",notes:{},choices:{},hintOpens:0,projectTitle:"",finalReflection:"",nextIdea:"",savedToPortfolio:false});
 function readState(){
  const base=initial();
  try{
   const value=JSON.parse(sessionStorage.getItem(KEY)||"null");
   if(value?.version!==1)return base;
   if(Number.isInteger(value.chapter)&&value.chapter>=0&&value.chapter<=8)base.chapter=value.chapter;
   if(["guiado","acompanhado","exploratorio"].includes(value.mode))base.mode=value.mode;
   if(Number.isInteger(value.codeStep)&&value.codeStep>=0&&value.codeStep<=3)base.codeStep=value.codeStep;
   if(typeof value.code==="string")base.code=value.code.slice(0,8000);
   if(value.notes&&typeof value.notes==="object"){
    for(const key of ["noteStudio","noteModel","noteTesting","noteLoop","noteBug"]){
     if(typeof value.notes[key]==="string")base.notes[key]=value.notes[key].slice(0,500);
    }
   }
   if(value.choices&&typeof value.choices==="object"){
    for(const key of ["properties","distance","collision","bug"]){
     if(typeof value.choices[key]==="string")base.choices[key]=value.choices[key].slice(0,40);
    }
   }
   if(Number.isInteger(value.hintOpens)&&value.hintOpens>=0)base.hintOpens=Math.min(100,value.hintOpens);
   if(typeof value.projectTitle==="string")base.projectTitle=value.projectTitle.slice(0,70);
   if(typeof value.finalReflection==="string")base.finalReflection=value.finalReflection.slice(0,700);
   if(typeof value.nextIdea==="string")base.nextIdea=value.nextIdea.slice(0,400);
   base.savedToPortfolio=value.savedToPortfolio===true;
  }catch(_){}
  return base;
 }
 let state=readState();
 let loopToken=0;
 let printUrl=null;
 function save(){
  try{sessionStorage.setItem(KEY,JSON.stringify(state));}
  catch(_){ /* sem persistência quando o navegador restringe o armazenamento */ }
 }
 function themeApply(mode){
  const t=mode==="light"?"light":"dark";
  document.body.dataset.theme=t;
  $("themeToggle").textContent=t==="dark"?"☀ Tema claro":"☾ Tema escuro";
  try{localStorage.setItem("edulegal-interface-theme",t);}catch(_){}
 }
 let savedTheme="dark";
 try{savedTheme=localStorage.getItem("edulegal-interface-theme")||"dark";}catch(_){}
 themeApply(savedTheme);
 $("themeToggle").addEventListener("click",()=>themeApply(document.body.dataset.theme==="dark"?"light":"dark"));
 const modeMessages={
  guiado:"Vamos por partes: instruções pequenas e concretas. Você pode experimentar antes de consultar uma pista.",
  acompanhado:"Você terá os desafios e poderá abrir orientações adicionais quando sentir necessidade.",
  exploratorio:"Você pode experimentar mais livremente. As explicações continuam disponíveis quando precisar."
 };
 function applyMode(mode){
  if(!Object.prototype.hasOwnProperty.call(modeMessages,mode))return;
  state.mode=mode;
  document.body.dataset.mode=mode;
  $("supportMode").value=mode;
  $("modeInfo").textContent=modeMessages[mode];
  document.querySelectorAll("[data-mode-text]").forEach(p=>p.hidden=p.dataset.modeText!==mode);
  save();
 }
 $("supportMode").addEventListener("change",e=>applyMode(e.target.value));
 function displayChapter(chapter){
  if(!Number.isInteger(chapter)||chapter<0||chapter>8)return;
  if(chapter!==6)stopLoop();
  state.chapter=chapter;save();
  document.querySelectorAll("[data-screen]").forEach(el=>el.hidden=Number(el.dataset.screen)!==chapter);
  document.querySelectorAll("[data-chapter]").forEach(b=>{
   const active=Number(b.dataset.chapter)===chapter;
   b.classList.toggle("active",active);
   if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
  });
  $("chapterCount").textContent="CAPÍTULO "+(chapter+1)+" DE 9";
  if(chapter===0)renderPlan();
  if(chapter===5)renderCodeStep();
  if(chapter===8)renderSummary();
  $("main").focus({preventScroll:true});
  window.scrollTo({top:0,behavior:"auto"});
 }
 document.querySelectorAll("[data-chapter]").forEach(b=>b.addEventListener("click",()=>displayChapter(Number(b.dataset.chapter))));
 document.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>displayChapter(state.chapter+1)));
 document.querySelectorAll("[data-prev]").forEach(b=>b.addEventListener("click",()=>displayChapter(state.chapter-1)));
 // Lê o plano demonstrativo da mesma aba, nunca dados de outra conta autenticada.
 function renderPlan(){
  let today=[];
  try{
   const d=JSON.parse(sessionStorage.getItem(BOOK0_KEY)||"null");
   if(d?.version===1&&d.choice==="roblox"&&d.completedAt&&Array.isArray(d.plan?.today)){
    const catalog=["Conhecer a área de trabalho, o Explorer e a janela Propriedades","Construir uma plataforma com uma Part e testar Anchored","Criar e testar um pequeno percurso de obstáculos","Explorar Transparency e CanCollide","Escrever um Script em pequenas etapas"];
    today=d.plan.today.filter(id=>/^roblox-[1-5]$/.test(id)).map(id=>catalog[Number(id.split("-")[1])-1]).filter(Boolean);
   }
  }catch(_){}
  $("planSummary").textContent=today.length?"Seu plano de hoje inclui: "+today.join(" · ")+". Você pode alterar suas escolhas na página Projetos.":"Ainda não escolheu tarefas para hoje? Você pode organizá-las no Backlog de Projetos quando quiser.";
 }
 // Desenho interativo: primeiro identificar uma peça, depois reconhecer suas propriedades.
 // É uma simulação explicativa; não observa o Roblox Studio do aluno.
 function selectStudioPart(){
  const scene=$("diagramScenePart"),explorer=$("diagramExplorerPart");
  scene.classList.add("is-selected");explorer.classList.add("is-selected");
  scene.setAttribute("aria-pressed","true");explorer.setAttribute("aria-pressed","true");
  const table=$("diagramProperties");table.replaceChildren();
  for(const [name,value] of [["Name","Part"],["Color","Dourado"],["Size","4, 1, 4"],["Anchored","false"]]){
   const row=document.createElement("div");row.className="diagram-prop-row";
   const key=document.createElement("span");key.textContent=name;
   const val=document.createElement("span");val.textContent=value;val.className="prop-value";
   row.append(key,val);table.append(row);
  }
  $("diagramFeedback").textContent="Você selecionou a mesma Part! Ela está destacada no mundo 3D e no Explorer. Properties agora mostra características dessa peça. Experimente também no Roblox Studio.";
 }
 for(const id of ["diagramScenePart","diagramExplorerPart"])$(id).addEventListener("click",selectStudioPart);
 const answers={
  properties:{correct:"properties",yes:"Isso! Depois de selecionar a Part no Explorer, encontramos suas características em Properties. Agora tente localizar Name e Color no próprio Studio.",no:"Vamos olhar de novo: Explorer é a lista de objetos, e Play testa o jogo. Clique na Part no desenho acima e veja qual janela mostra Name, Color e Size."},
  distance:{correct:"dificil",yes:"Isso é uma boa previsão. Teste na prática e veja se seu personagem consegue completar o salto.",no:"Faça o teste no Studio: se a distância aumentar demais, será que o personagem ainda alcança a próxima plataforma?"},
  collision:{correct:"cancollide",yes:"Exatamente. Transparency altera o visual; CanCollide define se a peça pode bloquear a passagem.",no:"Pense na diferença entre ver uma peça e poder atravessá-la. Qual propriedade controla a colisão?"},
  bug:{correct:"colisao",yes:"Boa investigação! Verificar CanCollide ajuda a entender por que o personagem continua pisando no bloco invisível.",no:"Antes de apagar tudo, tente localizar a propriedade relacionada a colisões. Você pode abrir uma pista."}
 };
 document.querySelectorAll("[data-check]").forEach(b=>b.addEventListener("click",()=>{
  const group=b.dataset.check,choice=b.dataset.value,answer=answers[group];
  if(!answer)return;
  state.choices[group]=choice;save();
  document.querySelectorAll('[data-check="'+group+'"]').forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.value===choice)));
  const target=$("feedback"+(group==="properties"?"Properties":group==="distance"?"Distance":group==="collision"?"Collision":"Bug"));
  if(target)target.textContent=choice===answer.correct?answer.yes:answer.no;
 }));
 for(const [key,value] of Object.entries(state.choices)){
  document.querySelectorAll('[data-check="'+key+'"]').forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.value===value)));
 }
 // Animação simplificada de Anchored.
 function setAnchor(on){
  $("physicsCube").classList.toggle("fallen",!on);
  $("physicsLabel").textContent=on?"Anchored = true: peça fixa":"Anchored = false: peça solta";
  $("physicsFeedback").textContent=on?"A peça permanece na posição escolhida.":"Sem Anchored, a gravidade pode fazer a peça cair.";
 }
 $("anchorYes").addEventListener("click",()=>setAnchor(true));
 $("anchorNo").addEventListener("click",()=>setAnchor(false));
 setAnchor(true);
 // Simulação de propriedades (não de física do Roblox).
 function renderProperties(){
  const visible=$("visibleToggle").value==="0",solid=$("collideToggle").value==="true";
  $("propWall").classList.toggle("invisible",!visible);
  $("propWall").classList.toggle("nocollide",!solid);
  $("propFeedback").textContent=(visible?"A peça está visível.":"A peça está invisível.")+" "+(solid?"Ela continua sólida e pode bloquear o personagem.":"Com CanCollide desligado, o personagem pode atravessá-la.");
 }
 $("visibleToggle").addEventListener("change",renderProperties);
 $("collideToggle").addEventListener("change",renderProperties);
 renderProperties();
 // Salvar textos digitados sem inferir emoções ou competências.
 for(const id of ["noteStudio","noteModel","noteTesting","noteLoop","noteBug"]){
  $(id).value=state.notes[id]||"";
  $(id).addEventListener("input",()=>{
   state.notes[id]=$(id).value.slice(0,500);save();
  });
 }
 // Pistas são opcionais e são contabilizadas apenas como eventos, não como medida de autonomia.
 document.querySelectorAll("details").forEach(d=>d.addEventListener("toggle",()=>{
  if(d.open){state.hintOpens+=1;save();}
 }));
 const codeSteps=[
  {title:"1. Qual peça vamos controlar?",instructions:"Apague a linha automática que o Roblox Studio pode criar no Script. Escreva uma linha que dê o nome plataforma à Part que contém o Script. Comece por: local ...",explain:"local cria um nome de trabalho. script.Parent indica a Part que contém este Script.",hint1:"Estamos dentro de um Script que é filho de PlataformaMagica. Como se escreve 'o pai deste Script'?",hint2:"Use esta estrutura e complete no editor: local plataforma = script.Parent"},
  {title:"2. Faça a peça desaparecer",instructions:"Mantenha sua primeira linha. Abaixo dela, adicione uma linha para definir Transparency como 1 e outra para definir CanCollide como false. Teste no Play: a peça deve ficar invisível e atravessável.",explain:"O ponto (.) acessa a propriedade de uma peça. Transparency = 1 oculta; CanCollide = false permite atravessar.",hint1:"Comece uma linha com plataforma.Transparency e outra com plataforma.CanCollide.",hint2:"As duas novas linhas são: plataforma.Transparency = 1  e  plataforma.CanCollide = false. Escreva-as em linhas separadas."},
  {title:"3. Faça a peça reaparecer",instructions:"Mantenha as linhas anteriores. Acrescente uma pausa de 2 segundos com task.wait(2); depois faça Transparency voltar a 0 e CanCollide voltar a true. Teste novamente no Studio.",explain:"task.wait(2) faz o Script esperar aproximadamente 2 segundos. A peça volta a ficar visível e sólida depois da pausa.",hint1:"Você precisará de task.wait(2), de Transparency = 0 e de CanCollide = true.",hint2:"Depois das linhas para desaparecer, acrescente: task.wait(2); na linha seguinte, plataforma.Transparency = 0; depois, plataforma.CanCollide = true."},
  {title:"4. Agora vamos repetir!",instructions:"Mantenha a declaração local fora da repetição. Escreva while true do na linha seguinte e coloque, dentro do loop, uma pausa de 3 segundos ANTES de desaparecer. Mantenha o desaparecimento, a pausa de 2 segundos e o reaparecimento. Feche o loop com end. Teste no Studio.",explain:"while true do significa 'repetir enquanto for verdadeiro'. end encerra o bloco de instruções. Pausas com task.wait() evitam repetição sem intervalo.",hint1:"A estrutura começa com local plataforma = script.Parent. Depois vem while true do; em seguida as linhas do ciclo, com task.wait(3) antes de ficar invisível, e termina com end.",hint2:"Ordem das ideias: declarar a peça → abrir while true do → esperar 3 segundos → esconder e desligar colisão → esperar 2 segundos → mostrar e ligar colisão → end. A indentação ajuda a enxergar o loop."}
 ];
 let codeStep=state.codeStep;
 function renderCodeStep(){
  codeStep=state.codeStep;
  const data=codeSteps[codeStep];
  $("codeTitle").textContent=data.title;
  $("codeInstructions").textContent=data.instructions;
  $("codeExplanation").textContent=data.explain;
  $("codeHintText1").textContent=data.hint1;
  $("codeHintText2").textContent=data.hint2;
  $("codeHint1").open=false;
  $("codeHint2").open=false;
  $("codeFeedback").textContent="";
  document.querySelectorAll("[data-code-step]").forEach(btn=>btn.classList.toggle("active",Number(btn.dataset.codeStep)===codeStep));
  $("codeNext").textContent=codeStep===3?"Ir para a simulação do ciclo →":"Próximo microdesafio →";
 }
 document.querySelectorAll("[data-code-step]").forEach(b=>b.addEventListener("click",()=>{
  state.codeStep=Number(b.dataset.codeStep);save();renderCodeStep();
 }));
 $("scriptEditor").value=state.code;
 $("scriptEditor").addEventListener("input",()=>{
  state.code=$("scriptEditor").value.slice(0,8000);state.savedToPortfolio=false;save();
 });
 // Editor de APOIO: as verificações só buscam elementos e a ordem. Não executa Luau.
 function verifyCode(text,stage){
  const code=text.replace(/--[^\n]*/g,"").replace(/\r/g,"");
  const required=[
   {test:/\blocal\s+plataforma\s*=\s*script\s*\.\s*Parent\b/,message:"Encontre ou escreva: local plataforma = script.Parent"},
   {test:/\bplataforma\s*\.\s*Transparency\s*=\s*1\b/,message:"Falta uma linha que torne a plataforma invisível (Transparency = 1)."},
   {test:/\bplataforma\s*\.\s*CanCollide\s*=\s*false\b/,message:"Falta desligar a colisão (CanCollide = false)."},
   {test:/\btask\s*\.\s*wait\s*\(\s*2\s*\)/,message:"Falta uma pausa de 2 segundos (task.wait(2))."},
   {test:/\bplataforma\s*\.\s*Transparency\s*=\s*0\b/,message:"Falta mostrar a plataforma novamente (Transparency = 0)."},
   {test:/\bplataforma\s*\.\s*CanCollide\s*=\s*true\b/,message:"Falta ligar novamente CanCollide (true)."}
  ];
  const counts=[1,3,6,6];
  for(let i=0;i<counts[stage];i++)if(!required[i].test.test(code))return {ok:false,message:required[i].message};
  if(stage===3){
   const loop=/\bwhile\s+true\s+do\b/.exec(code);
   const wait3=/\btask\s*\.\s*wait\s*\(\s*3\s*\)/.exec(code);
   const end=/\bend\b/g;
   const endings=[...code.matchAll(end)];
   if(!loop)return {ok:false,message:"Ainda não encontrei while true do."};
   if(!wait3)return {ok:false,message:"Falta incluir task.wait(3) antes do desaparecimento."};
   if(!endings.length)return {ok:false,message:"Falta fechar a repetição com end."};
   const orderPatterns=[
    /\bwhile\s+true\s+do\b/,
    /\btask\s*\.\s*wait\s*\(\s*3\s*\)/,
    /\bplataforma\s*\.\s*Transparency\s*=\s*1\b/,
    /\bplataforma\s*\.\s*CanCollide\s*=\s*false\b/,
    /\btask\s*\.\s*wait\s*\(\s*2\s*\)/,
    /\bplataforma\s*\.\s*Transparency\s*=\s*0\b/,
    /\bplataforma\s*\.\s*CanCollide\s*=\s*true\b/,
    /\bend\b/
   ];
   let position=-1;
   for(const pat of orderPatterns){
    const tail=code.slice(position+1),hit=pat.exec(tail);
    if(!hit)return {ok:false,message:"Confira a ordem dentro do loop: esperar 3 s → desaparecer → esperar 2 s → reaparecer → end."};
    position=position+1+hit.index;
   }
   if(!/\blocal\s+plataforma\s*=\s*script\s*\.\s*Parent\b/.test(code.slice(0,loop.index)))
    return {ok:false,message:"Coloque a declaração local plataforma = script.Parent ANTES do while true do."};
  }
  return {ok:true,message:stage===3?
   "Você incluiu os elementos esperados! Agora teste no Roblox Studio: a plataforma deve esperar 3 segundos, sumir por 2 e reaparecer. A conferência de texto não garante que o Script funcione.":
   "Os elementos desta etapa estão presentes. Copie conscientemente o que você escreveu para o Script no Roblox Studio e teste o comportamento."};
 }
 $("checkCode").addEventListener("click",()=>{
  const result=verifyCode($("scriptEditor").value,codeStep);
  $("codeFeedback").textContent=result.message;
  state.code=$("scriptEditor").value.slice(0,8000);save();
 });
 $("codeNext").addEventListener("click",()=>{
  state.code=$("scriptEditor").value.slice(0,8000);save();
  if(codeStep<3){state.codeStep=codeStep+1;save();renderCodeStep();}
  else displayChapter(6);
 });
 $("resetEditor").addEventListener("click",()=>{
  if(!window.confirm("Limpar apenas o código do editor? Seu texto atual será apagado."))return;
  $("scriptEditor").value="";state.code="";state.savedToPortfolio=false;save();
  $("codeFeedback").textContent="Editor limpo. Experimente escrever a próxima linha.";
 });
 $("scriptEditor").addEventListener("keydown",e=>{
  if(e.key==="Tab"){
   e.preventDefault();
   const box=e.target,start=box.selectionStart,end=box.selectionEnd;
   box.value=box.value.slice(0,start)+"    "+box.value.slice(end);
   box.selectionStart=box.selectionEnd=start+4;
   box.dispatchEvent(new Event("input",{bubbles:true}));
  }
 });
 $("openLoopEditor").addEventListener("click",()=>{
  state.codeStep=3;save();displayChapter(5);
 });
 // A simulação da plataforma é APENAS visual.
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function setLoopVisible(visible){
  $("loopPlatform").classList.toggle("invisible",!visible);
  $("loopStatus").textContent=visible?"Plataforma visível — é possível pisar nela.":"Plataforma invisível — na versão programada, desligaremos também CanCollide.";
 }
 function stopLoop(){
  loopToken++;
  setLoopVisible(true);
  $("startLoop").disabled=false;
 }
 $("startLoop").addEventListener("click",async()=>{
  const token=++loopToken;
  $("startLoop").disabled=true;
  // Máximo de três ciclos para ser uma demonstração finita e não distrair o estudante.
  for(let i=0;i<3;i++){
   setLoopVisible(true);await sleep(3000);if(token!==loopToken)return;
   setLoopVisible(false);await sleep(2000);if(token!==loopToken)return;
  }
  if(token!==loopToken)return;
  stopLoop();$("loopStatus").textContent="A demonstração terminou após três ciclos. No Studio, o loop continua enquanto o jogo estiver em execução.";
 });
 $("stopLoop").addEventListener("click",()=>{stopLoop();$("loopStatus").textContent="Simulação parada. Você pode testar novamente.";});
 // Print: prévia local, não armazenar a imagem nem enviar bytes.
 function clearPrint(){
  if(printUrl){URL.revokeObjectURL(printUrl);printUrl=null;}
  $("projectPrint").value="";
  $("printPreview").removeAttribute("src");
  $("printPreview").hidden=true;
  $("clearPrint").hidden=true;
 }
 $("projectPrint").addEventListener("change",e=>{
  clearPrintPreviewOnly();
  const file=e.target.files?.[0];
  if(!file)return;
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>4*1024*1024||file.size===0){
   $("printStatus").textContent="Escolha uma imagem PNG, JPG ou WebP de até 4 MB.";
   e.target.value="";return;
  }
  printUrl=URL.createObjectURL(file);
  $("printPreview").src=printUrl;
  $("printPreview").hidden=false;
  $("clearPrint").hidden=false;
  $("printStatus").textContent="Prévia carregada apenas nesta página. A EduLegal ainda não armazenou nem analisou seu print.";
 });
 function clearPrintPreviewOnly(){
  if(printUrl){URL.revokeObjectURL(printUrl);printUrl=null;}
  $("printPreview").removeAttribute("src");
  $("printPreview").hidden=true;$("clearPrint").hidden=true;
  $("printStatus").textContent="";
 }
 $("clearPrint").addEventListener("click",()=>{clearPrint();$("printStatus").textContent="Imagem retirada da prévia.";});
 // Registros reflexivos: descrições factuais, sem pontuação e sem diagnósticos.
 $("projectTitle").value=state.projectTitle;
 $("finalReflection").value=state.finalReflection;
 $("nextIdea").value=state.nextIdea;
 for(const [id,key,limit] of [["projectTitle","projectTitle",70],["finalReflection","finalReflection",700],["nextIdea","nextIdea",400]]){
  $(id).addEventListener("input",()=>{state[key]=$(id).value.slice(0,limit);state.savedToPortfolio=false;save();});
 }
 function renderSummary(){
  const container=$("summaryData");container.replaceChildren();
  const entries=[
   ["Capítulos","Você visitou o capítulo "+(state.chapter+1)+" de 9. Visitar uma página não comprova que a atividade foi realizada no Studio."],
   ["Editor","Você registrou "+(state.code.trim()?"um texto de código":"nenhum código")+" neste protótipo. A EduLegal não consegue conferir sozinha o funcionamento no Studio."],
   ["Reflexões",Object.values(state.notes).filter(x=>typeof x==="string"&&x.trim()).length+" registro(s) descritivo(s) nas atividades."],
   ["Orientações","Você escolheu o modo "+({"guiado":"Passo a passo","acompanhado":"Dicas quando precisar","exploratorio":"Mais independente"}[state.mode])+". Isso não é uma classificação de capacidade."]
  ];
  for(const [title,text] of entries){const p=document.createElement("p");const b=document.createElement("strong");b.textContent=title+": ";p.append(b,document.createTextNode(text));container.append(p);}
 }
 $("saveFinal").addEventListener("click",()=>{
  state.projectTitle=$("projectTitle").value.trim().slice(0,70);
  state.finalReflection=$("finalReflection").value.trim().slice(0,700);
  state.nextIdea=$("nextIdea").value.trim().slice(0,400);
  if(!state.projectTitle){$("saveStatus").textContent="Dê um nome ao seu jogo para preparar o rascunho do Portfólio.";return;}
  state.savedToPortfolio=true;
  save();
  $("saveStatus").textContent="Seu rascunho foi preparado nesta aba! Você pode abrir o Portfólio de demonstração. O print não é salvo e nenhum badge foi concedido automaticamente.";
 });
 // Rotinas de demonstração: não apagam dados de outros livros nem autenticações.
 function initResetLink(){
  const footer=document.querySelector(".footer");const button=document.createElement("button");
  button.type="button";button.className="soft";button.textContent="Reiniciar somente este livro";
  button.style.marginTop="14px";
  button.addEventListener("click",()=>{
   if(!window.confirm("Reiniciar somente o Livro 1? Isso apagará suas anotações e código desta demonstração, mas não o Livro 0."))return;
   sessionStorage.removeItem(KEY);
   window.location.reload();
  });
  footer.append(document.createElement("br"),button);
 }
 initResetLink();
 applyMode(state.mode);
 renderCodeStep();
 // Ao chegar pelo quadro Projetos, abrir a missão correspondente sem criar outro planejamento.
 const chapterFromTask=new URLSearchParams(window.location.search).get("chapter");
 if(chapterFromTask!==null&&/^[0-8]$/.test(chapterFromTask)){
  displayChapter(Number(chapterFromTask));
  // O próximo recarregamento deve usar o progresso salvo, e não reabrir obrigatoriamente este capítulo.
  try{
   const cleanUrl=new URL(window.location.href);
   cleanUrl.searchParams.delete("chapter");
   window.history.replaceState(null,"",cleanUrl.pathname+cleanUrl.search+cleanUrl.hash);
  }catch(_){}
 }else displayChapter(state.chapter);
 window.addEventListener("pagehide",()=>{
  loopToken++;
  if(printUrl)URL.revokeObjectURL(printUrl);
 });
})();
