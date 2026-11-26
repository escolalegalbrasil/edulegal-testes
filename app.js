"use strict";
/* Referencia visual: EduLegal_Laboratorio_Visual(1).html
   Ambiente exclusivo de testes: nenhum dado ou chave de producao. */
const icons={home:'<path d="m3 10 9-7 9 7v10H15v-6H9v6H3z"/>',book:'<path d="M12 5c-3-3-7-3-10-2v16c4-1 7 0 10 2 3-2 6-3 10-2V3c-3-1-7-1-10 2v16"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-2-15-4 18"/>',chat:'<path d="M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.8-5A9 9 0 1 1 21 11z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',case:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v3h4v-3"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',game:'<path d="M7 6h10c3 0 4 3 5 9s-3 5-6 2H8c-3 3-7 4-6-2s2-9 5-9zM7 9v6m-3-3h6m7-2h.01m3 3h.01"/>',cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/>',pen:'<path d="m3 3 15 5 3 10-3 3-10-3L3 3zm0 0 9 9m0 0a2 2 0 1 0 3 3 2 2 0 0 0-3-3"/>',bulb:'<path d="M9 18h6m-5 3h4M8 15a7 7 0 1 1 8 0l-1 3H9z"/>'};
const defaults={dark:{bg:'#313338',header:'#232428',sidebar:'#2B2D31',card:'#383A40',feature:'#383A40',border:'#47494F',selected:'#4E5058',title:'#F2F3F5',text:'#DBDEE1',muted:'#B5BAC1',navtext:'#DBDEE1',selectedtext:'#F2F3F5',cardtext:'#F2F3F5',brand:'#F4D78C',accent:'#F4D78C',featurelabel:'#F4D78C',track:'#50535B',progress:'#F4D78C',button:'#4E5058',buttontext:'#F2F3F5',buttonarrow:'#F4D78C',navicon:'#B5BAC1',projectsicon:'#8CB9DA',mentoricon:'#83B89C',robloxicon:'#F4D78C',roboticon:'#8CB9DA',webicon:'#8CB9DA',writeicon:'#83B89C',idea:'#383A40',ideaicon:'#F4D78C',ideatext:'#F4D78C'},light:{bg:'#FBF8EF',header:'#FFFDF8',sidebar:'#F0EEE6',card:'#FFFDF8',feature:'#FFFDF8',border:'#DEDCD3',selected:'#E3E1DA',title:'#253832',text:'#253832',muted:'#626C65',navtext:'#253832',selectedtext:'#253832',cardtext:'#253832',brand:'#A67516',accent:'#F4D78C',featurelabel:'#8A6419',track:'#E3E1DA',progress:'#D6AC50',button:'#E5E3DD',buttontext:'#253832',buttonarrow:'#8A6419',navicon:'#626C65',projectsicon:'#286B98',mentoricon:'#21765E',robloxicon:'#A67516',roboticon:'#286B98',webicon:'#286B98',writeicon:'#21765E',idea:'#FFF8E5',ideaicon:'#A67516',ideatext:'#8A6419'}};
const API_URL="https://feijoegkjleirfzbumnk.supabase.co";
const API_KEY="sb_publishable_pzytAyOPleWQVrTnzg22ew_qAcIgVQu";
const app=window.supabase ? window.supabase.createClient(API_URL,API_KEY) : null;
const $=id=>document.getElementById(id);
const state={demo:false,user:null,memberships:[],orgs:[],orgId:null,role:null,trails:[],view:"inicio"};
const pages=["inicio","livros","projetos","mentoria","portfolio"];
const clone=x=>JSON.parse(JSON.stringify(x));
let palettes=clone(defaults);
let theme="dark";
try{
  const saved=JSON.parse(localStorage.getItem("edulegal-design-lab-v1")||"null");
  if(saved&&saved.palettes){
    for(const mode of ["dark","light"])
      for(const k of Object.keys(defaults[mode]))
        if(/^#[0-9a-f]{6}$/i.test(saved.palettes?.[mode]?.[k]||""))
          palettes[mode][k]=saved.palettes[mode][k];
  }
  theme=localStorage.getItem("edulegal-interface-theme")||saved?.mode||"dark";
}catch(_){}
if(!["dark","light"].includes(theme))theme="dark";

function applyTheme(){
 const p=$("preview");
 Object.entries(palettes[theme]).forEach(([k,v])=>p.style.setProperty("--"+k,v));
 for(const [id,mode] of [["themeDark","dark"],["themeLight","light"]]){
   $(id).classList.toggle("active",theme===mode);
   $(id).setAttribute("aria-pressed",String(theme===mode));
 }
 localStorage.setItem("edulegal-interface-theme",theme);
}
function mountIcons(root=document){
 root.querySelectorAll("[data-icon]").forEach(el=>{
  if(el.querySelector("svg"))return;
  const path=icons[el.dataset.icon];
  if(path)el.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
 });
}
function showLogin(msg=""){
 $("loginScreen").hidden=false;
 $("appShell").hidden=true;
 $("loginStatus").textContent=msg;
}
function showApp(){
 $("loginScreen").hidden=true;
 $("appShell").hidden=false;
 $("accountLabel").textContent=state.demo?"Prévia visual":(state.user?.email||"Meu espaço");
 const menu=$("primaryNav");
 const extra=menu.querySelector("[data-view=gestao]");
 if(extra)extra.remove();
 if(!state.demo&&["director","teacher"].includes(state.role)){
  const b=document.createElement("button");
  b.type="button";b.className="navitem";b.dataset.view="gestao";
  b.addEventListener("click",()=>navigate("gestao"));
  const t=document.createElement("span");t.dataset.icon="case";b.append(t,document.createTextNode("Painel da escola"));
  menu.appendChild(b);mountIcons(b);
 }
 navigate(state.view);
}
function roleName(r){return ({director:"Diretor",teacher:"Professor",student:"Aluno"})[r]||"Usuário";}
async function updateMemberships(){
 if(!app||!state.user)return;
 const {data:m,error}=await app.from("organization_members").select("organization_id,role,approved").eq("user_id",state.user.id);
 if(error)throw Error("Falha ao consultar vínculos do usuário: "+error.message);
 state.memberships=(m||[]).filter(x=>x.approved);
 state.orgs=[];
 if(state.memberships.length){
   const {data:orgs,error:orgError}=await app.from("organizations").select("id,name").in("id",state.memberships.map(x=>x.organization_id));
   if(orgError)throw Error("Falha ao carregar escolas: "+orgError.message);
   state.orgs=orgs||[];
 }
 if(!state.memberships.some(x=>x.organization_id===state.orgId))state.orgId=state.memberships[0]?.organization_id||null;
 state.role=state.memberships.find(x=>x.organization_id===state.orgId)?.role||null;
 await loadTrails();
}
async function loadTrails(){
 state.trails=[];
 if(state.demo||!state.orgId)return;
 const {data,error}=await app.from("trails").select("id,title,created_at").eq("organization_id",state.orgId).order("created_at",{ascending:false}).limit(30);
 if(error)throw Error("Falha na leitura das mentorias: "+error.message);
 state.trails=data||[];
}
async function refreshAuth(){
 if(state.demo)return;
 if(!app){showLogin("Biblioteca Supabase indisponível; verifique a conexão.");return;}
 try{
  const {data,error}=await app.auth.getUser();
  if(state.demo)return;
  if(error||!data?.user){state.demo=false;state.user=null;showLogin();return;}
  state.demo=false;state.user=data.user;
  await updateMemberships();
  showApp();
 }catch(err){showLogin("Não foi possível validar a sessão: "+err.message);}
}
function el(tag,cls,content){
 const n=document.createElement(tag);
 if(cls)n.className=cls;
 if(content!==undefined)n.textContent=content;
 return n;
}
function heading(eyebrow,title){
 const wrap=el("div","section-main");
 wrap.append(el("div","eyebrow",eyebrow),el("h1","",title),el("div","dash"));
 return wrap;
}
function notice(txt){
 return el("div","notice info",txt);
}
function navButton(label,target,className=""){
 const b=el("button",className,label);b.type="button";
 b.addEventListener("click",()=>navigate(target));return b;
}
/* Livro 0: os registros locais são usados SOMENTE na prévia fictícia, nunca na conta autenticada. */
const BOOK0_KEY="edulegal-testes-ponto-de-partida-v1";
const BOOK0_URL="./livros/ponto-de-partida/";
const BOOK1_KEY="edulegal-testes-obby-v1";
const BOOK1_URL="./livros/meu-primeiro-obby/";
const BOOK0_TASKS={
 roblox:["Conhecer a área de trabalho, o Explorer e a janela Propriedades","Construir uma plataforma com uma Part e testar Anchored","Criar e testar um pequeno percurso de obstáculos","Explorar Transparency e CanCollide","Escrever um Script em pequenas etapas"],
 robotica:["Conhecer um LED e o que ele faz","Reconhecer um circuito simples e seguro","Descobrir como acender e apagar uma luz com programação"],
 escrita:["Inventar um personagem","Escolher um lugar para a aventura","Criar um acontecimento inesperado"],
 web:["Conhecer uma página HTML","Criar um título e um pequeno texto","Mudar a aparência com CSS"],
 pico8:["Conhecer os personagens e o cenário de um jogo","Planejar um desafio simples","Experimentar movimentar um personagem no PICO-8"],
 video:["Escolher uma ideia para animar","Organizar duas ou três cenas","Experimentar uma sequência em movimento"]
};
const BOOK0_TITLES={roblox:"Meu Primeiro Obby",robotica:"Minha Primeira Luz",escrita:"Minha Primeira História",web:"Minha Primeira Página",pico8:"Meu Primeiro Jogo 2D",video:"Minha Primeira Animação"};
function demoBook0(){
 if(!state.demo)return null;
 try{const d=JSON.parse(sessionStorage.getItem(BOOK0_KEY)||"null");
   if(d?.version!==1||!Object.hasOwn(BOOK0_TASKS,d.choice))return null;
   if(d.completedAt&&d.plan?.mode!=="backlog-first"){
    const all=BOOK0_TASKS[d.choice].map((_,i)=>d.choice+"-"+(i+1));
    const today=Array.isArray(d.plan?.today)?d.plan.today:[];
    const later=Array.isArray(d.plan?.later)?d.plan.later:[];
    const autoToday=all.slice(0,2),autoLater=all.slice(2);
    const wasOldDefault=JSON.stringify(today)===JSON.stringify(autoToday)&&JSON.stringify(later)===JSON.stringify(autoLater);
    // O protótipo anterior preenchia duas tarefas automaticamente; não as tratar como escolha do aluno.
    const chosen=wasOldDefault?[]:today.filter(id=>all.includes(id));
    d.plan={today:chosen,later:all.filter(id=>!chosen.includes(id)),mode:"backlog-first"};
    sessionStorage.setItem(BOOK0_KEY,JSON.stringify(d));
   }
   return d;
 }catch(_){return null;}
}
function demoBook1(){
 if(!state.demo)return null;
 try{
  const d=JSON.parse(sessionStorage.getItem(BOOK1_KEY)||"null");
  if(d?.version!==1)return null;
  return d;
 }catch(_){return null;}
}
function demoBook1Link(label){
 const a=el("a","cta",label);a.href=BOOK1_URL;return a;
}
function demoTaskIds(book){return BOOK0_TASKS[book.choice].map((_,i)=>book.choice+"-"+(i+1));}
function demoTaskTitle(book,id){
 const idx=demoTaskIds(book).indexOf(id);
 return idx>=0?BOOK0_TASKS[book.choice][idx]:null;
}
function demoMoveTask(id,destination){
 const book=demoBook0();if(!book||!demoTaskTitle(book,id))return;
 const ids=demoTaskIds(book);
 const oldToday=Array.isArray(book.plan?.today)?book.plan.today.filter(x=>ids.includes(x)):[];
 const oldLater=Array.isArray(book.plan?.later)?book.plan.later.filter(x=>ids.includes(x)):[];
 book.plan={today:oldToday.filter(x=>x!==id),later:oldLater.filter(x=>x!==id),mode:"backlog-first"};
 if(destination==="today")book.plan.today.push(id);else book.plan.later.push(id);
 try{sessionStorage.setItem(BOOK0_KEY,JSON.stringify(book));}catch(_){}
 navigate("projetos");
}
function demoShiftTask(id,delta){
 const book=demoBook0();if(!book)return;
 const arr=Array.isArray(book.plan?.today)?book.plan.today.slice():[];
 const i=arr.indexOf(id),j=i+delta;if(i<0||j<0||j>=arr.length)return;
 [arr[i],arr[j]]=[arr[j],arr[i]];
 book.plan.today=arr;book.plan.mode="backlog-first";
 try{sessionStorage.setItem(BOOK0_KEY,JSON.stringify(book));}catch(_){}
 navigate("projetos");
}
function demoBookLink(label){
 const a=el("a","cta",label);a.href=BOOK0_URL;return a;
}
function renderOrgPicker(main){
 if(state.demo){main.append(notice("Prévia visual: os dados desta tela são fictícios. Nenhuma consulta ao Supabase é feita neste modo."));return;}
 if(!state.orgId){main.append(notice("Seu acesso ainda não está vinculado a uma escola aprovada. O diretor deverá autorizar essa conta de testes."));return;}
 const member=state.memberships.find(x=>x.organization_id===state.orgId);
 main.append(el("p","meta","Perfil: "+roleName(member?.role)+" · Ambiente de testes"));
 if(state.orgs.length>1){
  const s=el("select","org-select");s.setAttribute("aria-label","Escola ativa");
  state.orgs.forEach(o=>{const op=el("option","",o.name);op.value=o.id;op.selected=o.id===state.orgId;s.append(op);});
  s.addEventListener("change",async()=>{state.orgId=s.value;state.role=state.memberships.find(x=>x.organization_id===s.value)?.role||null;try{await loadTrails();showApp();}catch(e){main.append(notice(e.message));}});
  main.append(s);
 }
}
function renderHome(main){
 main.append(heading("MEU ESPAÇO DE APRENDIZAGEM","O que vamos criar hoje?"));
 const book=state.demo?demoBook0():null;
 const hasSuggestedTasks=Boolean(book?.completedAt&&BOOK0_TASKS[book.choice]?.length);
 const selectedToday=hasSuggestedTasks&&Array.isArray(book.plan?.today)
  ?book.plan.today.filter(id=>demoTaskTitle(book,id)):[];

 const card=el("section","continue");
 if(hasSuggestedTasks){
  card.append(el("div","eyebrow","MEU PLANEJAMENTO"));
  card.append(el("h2","",selectedToday.length?"Meu plano de hoje":"Que tal escolher o que fazer hoje?"));
  card.append(el("p","sub",selectedToday.length
   ?"Você escolheu "+selectedToday.length+" tarefa(s) do seu projeto. Pode consultar ou reorganizar seu plano quando quiser."
   :"Seu livro sugeriu tarefas para o Backlog. Escolha quais gostaria de experimentar hoje. Não precisa fazer tudo."));
  card.append(navButton(selectedToday.length?"Abrir meu planejamento →":"Escolher minhas tarefas →","projetos","cta"));
 }else{
  card.append(el("div","eyebrow","MEU PRIMEIRO PERCURSO"));
  card.append(el("h2","","Seu próximo projeto começa aqui"));
  card.append(el("p","sub","Explore os livros interativos, conheça possibilidades e escolha algo que gostaria de criar. As tarefas do projeto aparecerão depois no Backlog."));
  // Sem tarefas vinculadas, o botão nunca direciona para mentorias.
  card.append(navButton("Explorar meus livros →","livros","cta"));
 }
 main.append(card);

 if(state.demo&&hasSuggestedTasks){
  main.append(el("h2","section","Meu plano de hoje"));
  const summary=el("section","trail-item");
  if(!selectedToday.length)summary.append(el("p","meta","Ainda não escolheu tarefas para hoje. Vá a Projetos e arraste uma ou duas tarefas do Backlog."));
  selectedToday.forEach(id=>{
   const title=demoTaskTitle(book,id);
   if(title)summary.append(el("p","","• "+title));
  });
  summary.append(navButton("Ver todas as tarefas →","projetos","cta"));
  main.append(summary);
 }
 main.append(el("h2","section","Minhas explorações"));
 const tiles=el("div","tiles");
 for(const [title,icon] of [["Roblox Studio","game"],["Robótica","cpu"],["Desenvolvimento Web","code"],["Escrita criativa","pen"]]){
  const b=navButton(title,"livros","tile");
  const i=el("span");i.dataset.icon=icon;b.prepend(i);tiles.append(b);
 }
 main.append(tiles);
 const idea=el("div","idea");
 const ico=el("span");ico.dataset.icon="bulb";
 idea.append(ico,el("span","","Tem uma nova ideia de projeto? Descubra outras possibilidades nos livros."));
 idea.append(navButton("→","livros","idea-link"));
 main.append(idea);
 if(state.demo)main.append(notice("Prévia com dados fictícios: o planejamento é demonstrativo e fica somente nesta aba do navegador."));
 else main.append(notice("A integração das tarefas às contas do Supabase de testes ainda não foi implementada. Por enquanto, a página inicial encaminha para a biblioteca."));
 mountIcons(main);
}

function renderBooks(main){
 main.append(heading("BIBLIOTECA","Meus livros"));
 const book0=el("section","continue");
 book0.append(el("div","eyebrow","LIVRO 0 · ACOLHIMENTO"));
 book0.append(el("h2","","Ponto de Partida"));
 book0.append(el("p","sub","Conheça áreas da EduLegal, experimente pequenas atividades e escolha um primeiro projeto."));
 book0.append(demoBookLink("Abrir Livro 0 →"));main.append(book0);
 const book1=el("section","continue");
 book1.style.marginTop="14px";
 book1.append(el("div","eyebrow","LIVRO 1 · ROBLOX STUDIO"));
 book1.append(el("h2","","Meu Primeiro Obby"));
 book1.append(el("p","sub","Construa plataformas, teste obstáculos, experimente propriedades e escreva aos poucos um Script em Luau. Inclui pistas graduais e três modos de orientação."));
 book1.append(demoBook1Link("Abrir Livro 1 →"));main.append(book1);
 main.append(notice("Esses livros ainda são protótipos demonstrativos. Suas respostas não serão salvas no Supabase nem associadas a contas. Use apenas dados fictícios."));
}

function renderProjects(main){
 main.append(heading("MEUS PROJETOS","O que estou criando?"));
 const book=demoBook0();
 if(!state.demo||!book?.completedAt){
  main.append(notice("Os projetos serão privados por padrão e poderão reunir tarefas, arquivos, registros, livros e mentorias. Integração em desenvolvimento."));
  if(state.demo)main.append(demoBookLink("Escolher um percurso no Livro 0 →"));
  return;
 }
 main.append(el("p","meta","Ideia de projeto: "+BOOK0_TITLES[book.choice]+" · Planejamento de demonstração"));
 main.append(notice("🗂 Planeje seu dia! No Backlog, à esquerda, estão todas as tarefas sugeridas pelo livro. Escolha uma ou duas que gostaria de experimentar hoje e arraste-as para “Vou fazer hoje”, à direita. Se preferir, use o botão “Fazer hoje”. Você pode mudar de ideia a qualquer momento."));
 const grid=el("div","plan-grid");
 const ids=demoTaskIds(book);
 const today=Array.isArray(book.plan?.today)?book.plan.today.filter(x=>ids.includes(x)):[];
 const later=Array.isArray(book.plan?.later)?book.plan.later.filter(x=>ids.includes(x)):[];
 for(const zone of ["later","today"]){
  const col=el("section","plan-column");
  col.append(el("h2","",zone==="later"?"Backlog · Todas as tarefas":"Vou fazer hoje"));
  const list=zone==="today"?today:later;
  if(zone==="today"&&!list.length)col.append(el("p","meta","Nenhuma tarefa escolhida ainda. Arraste para cá uma tarefa do Backlog ou clique em “Fazer hoje”."));
  if(zone==="later"&&!list.length)col.append(el("p","meta","Você já colocou todas as tarefas no seu plano. Pode devolvê-las aqui quando quiser."));
  list.forEach(id=>{
   const box=el("article","plan-task");
   box.draggable=true;
   box.append(el("strong","",demoTaskTitle(book,id)||"Tarefa"));
   const actions=el("div","plan-actions");
   const move=el("button","soft-btn",zone==="today"?"Voltar ao Backlog":"Fazer hoje");
   move.type="button";move.addEventListener("click",()=>demoMoveTask(id,zone==="today"?"later":"today"));actions.append(move);
   if(zone==="today"){
    for(const [label,delta] of [["↑ Antes",-1],["↓ Depois",1]]){
     const b=el("button","soft-btn",label);b.type="button";
     b.addEventListener("click",()=>demoShiftTask(id,delta));actions.append(b);
    }
   }
   box.append(actions);
   box.addEventListener("dragstart",ev=>{ev.dataTransfer.setData("text/plain",id);ev.dataTransfer.effectAllowed="move";});
   col.append(box);
  });
  col.addEventListener("dragover",ev=>{ev.preventDefault();col.classList.add("dragover");});
  col.addEventListener("dragleave",()=>col.classList.remove("dragover"));
  col.addEventListener("drop",ev=>{ev.preventDefault();col.classList.remove("dragover");const id=ev.dataTransfer.getData("text/plain");if(ids.includes(id))demoMoveTask(id,zone);});
  grid.append(col);
 }
 main.append(grid);
 if(book.choice==="roblox")main.append(demoBook1Link("Abrir Livro 1 — Meu Primeiro Obby →"));
 const note=el("p","meta","Estas são tarefas sugeridas, não uma avaliação de habilidades. O Livro 1 já pode ser experimentado em modo de testes.");main.append(note);
}

function renderMentoria(main){
 main.append(heading("CONVERSAS DE APRENDIZAGEM","Minhas mentorias"));
 if(state.demo){main.append(notice("Exemplo visual: Minha primeira loja no Roblox. Não é uma conversa real."));return;}
 if(!state.orgId)return;
 if(!state.trails.length){main.append(notice("Nenhuma mentoria visível para este perfil no ambiente de testes."));return;}
 const list=el("div","list-of-trails");
 state.trails.forEach(t=>{
  const card=el("div","trail-item");card.append(el("strong","",t.title||"Mentoria"));
  card.append(el("p","meta","Criada em "+new Date(t.created_at).toLocaleDateString("pt-BR")));
  card.append(el("p","meta","Este protótipo consulta títulos e não carrega conteúdo das conversas."));
  list.append(card);
 });
 main.append(list);
}
function renderPortfolio(main){
 main.append(heading("MINHAS CRIAÇÕES","Portfólio"));
 const book0=demoBook0();
 const book1=demoBook1();
 if(!state.demo||(!book0?.completedAt&&!book1?.savedToPortfolio)){
  main.append(notice("O portfólio poderá reunir projetos e conquistas, com publicação opcional e supervisão. Ainda não ativado para contas reais."));
  return;
 }
 if(book1?.savedToPortfolio&&book1.projectTitle){
  const card=el("section","trail-item");
  card.append(el("div","eyebrow","RASCUNHO PRIVADO · LIVRO 1"));
  card.append(el("h2","",book1.projectTitle));
  card.append(el("p","meta","Roblox Studio · Projeto registrado pelo aluno nesta demonstração; funcionamento e autoria ainda não foram verificados."));
  if(book1.finalReflection){
   card.append(el("strong","","O que descobri ou aprendi"));
   card.append(el("p","",book1.finalReflection));
  }
  if(book1.nextIdea){
   card.append(el("strong","","O que quero investigar depois"));
   card.append(el("p","",book1.nextIdea));
  }
  card.append(el("p","meta","A imagem escolhida no livro não é armazenada neste protótipo. Badges serão exibidos futuramente somente quando houver critérios e evidências validadas."));
  card.append(demoBook1Link("Continuar meu Obby →"));
  main.append(card);
 }
 if(book0?.completedAt){
  const card=el("section","trail-item");
  card.style.marginTop="14px";
  card.append(el("h2","","Projeto escolhido no acolhimento: "+BOOK0_TITLES[book0.choice]));
  card.append(el("p","meta","Ideia inicial do Livro 0, não uma criação comprovada."));
  if(book0.reflection)card.append(el("p","","Uma descoberta ou intenção registrada: "+book0.reflection));
  main.append(card);
 }
 main.append(notice("Prévia de portfólio apenas nesta sessão e neste modo de demonstração. Não há publicação pública, análise de IA nem concessão automática de badges."));
}

function renderGestao(main){
 main.append(heading("ACOMPANHAMENTO","Painel da escola"));
 main.append(notice("Perfil "+roleName(state.role)+": as ferramentas de convites e moderação estão em desenvolvimento no banco de testes."));
 const a=el("a","link","Abrir verificador de acessos (somente leitura)");
 a.href="./painel-acessos.html";main.append(a);
}
function navigate(page){
 if(!pages.includes(page)&&page!=="gestao")page="inicio";
 if(page==="gestao"&&!["director","teacher"].includes(state.role))page="inicio";
 state.view=page;
 document.querySelectorAll("[data-view]").forEach(b=>{
  const current=b.dataset.view===page;
  b.classList.toggle("active",current);
  if(current)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
 });
 const main=$("viewContent");main.replaceChildren();
 renderOrgPicker(main);
 if(page==="inicio")renderHome(main);
 else if(page==="livros")renderBooks(main);
 else if(page==="projetos")renderProjects(main);
 else if(page==="mentoria")renderMentoria(main);
 else if(page==="portfolio")renderPortfolio(main);
 else renderGestao(main);
}
$("themeDark").onclick=()=>{theme="dark";applyTheme();};
$("themeLight").onclick=()=>{theme="light";applyTheme();};
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$("demoBtn").onclick=()=>{state.demo=true;state.user=null;state.orgId=null;state.role="student";state.trails=[];state.view="inicio";showApp();};
$("exitBtn").onclick=async()=>{
 if(!state.demo&&app)await app.auth.signOut();
 state.user=null;state.demo=false;state.orgId=null;state.role=null;state.memberships=[];state.trails=[];state.view="inicio";
 showLogin();
};
$("loginForm").addEventListener("submit",async event=>{
 event.preventDefault();
 if(!app){showLogin("Cliente Supabase não carregou.");return;}
 $("loginBtn").disabled=true;$("loginStatus").textContent="Validando conta de testes...";
 const {error}=await app.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
 $("password").value="";$("loginBtn").disabled=false;
 if(error){$("loginStatus").textContent="Não foi possível entrar: "+error.message;return;}
 await refreshAuth();
});
mountIcons();
applyTheme();
// O parâmetro ?demo=1 exibe SOMENTE dados fictícios e não acessa informações da conta.
if(new URLSearchParams(window.location.search).get("demo")==="1"){
 state.demo=true;state.user=null;state.orgId=null;state.role="student";state.trails=[];
 state.view=new URLSearchParams(window.location.search).get("view")==="projetos"?"projetos":"inicio";showApp();
}else refreshAuth();
