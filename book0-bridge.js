"use strict";
/* Ponte Livro 0 → EduLegal (AMBIENTE DE TESTES).
 * O livro continua pedagogicamente independente. Esta integração só atua após
 * o aluno concluir e clicar para enviar seu percurso; não envia dados sozinha.
 * Autorização e isolamento são impostos pelo Supabase Auth + policies RLS.
 */
(function(){
 const PROJECT="feijoegkjleirfzbumnk";
 const API_URL="https://"+PROJECT+".supabase.co";
 const API_KEY="sb_publishable_pzytAyOPleWQVrTnzg22ew_qAcIgVQu";
 const OLD_DEMO_KEY="edulegal-testes-ponto-de-partida-v1";
 const AREAS={
  roblox:{category:"roblox",project:"Meu primeiro Obby"},
  robotics:{category:"robotica",project:"Minha primeira invenção eletrônica"},
  web:{category:"web",project:"Minha primeira página web"},
  writing:{category:"escrita",project:"Minha primeira aventura"},
  pico8:{category:"pico8",project:"Meu primeiro jogo 2D"},
  animation:{category:"video",project:"Minha primeira animação"}
 };
 const MAX_NOTES=400;
 let sending=false;
 const page=document.getElementById("page");
 if(!page||!window.EduLegalPontoDePartida)return;

 function getRecord(){return window.EduLegalPontoDePartida.getRecord();}
 function subset(source){
  // Não transmitir histórico bruto de cliques, tempos ou 600 eventos neste piloto.
  return {
   schemaVersion:1,bookId:source.bookId,bookVersion:source.bookVersion,
   completed:!!source.completed,
   pathDecision:source.pathDecision,
   chosenPath:source.chosenPath,
   interests:Array.isArray(source.interests)?source.interests.filter(x=>AREAS[x]):[],
   chaptersVisited:Array.isArray(source.chaptersVisited)?source.chaptersVisited.slice(0,5):[],
   priorKnowledge:source.priorKnowledge&&typeof source.priorKnowledge==="object"?source.priorKnowledge:{},
   experiences:Array.isArray(source.experiences)?source.experiences.slice(0,6).map(x=>({
    area:x.area,experienceId:x.experienceId,
    opened:!!x.opened,experimented:!!x.experimented,
    actionCount:Math.min(300,Math.max(0,Number(x.actionCount)||0)),
    hintLevels:Array.isArray(x.hintLevels)?x.hintLevels.slice(0,3):[],
    checkResponses:Array.isArray(x.checkResponses)?x.checkResponses.slice(-8):[],
    reflection:String(x.reflection||"").slice(0,MAX_NOTES)
   })):[]
  };
 }
 function isValid(record){
  return record?.schemaVersion===1 &&
   record.bookId==="edulegal-livro-0-ponto-de-partida" &&
   record.completed===true &&
   (record.chosenPath===null || Object.hasOwn(AREAS,record.chosenPath)) &&
   Array.isArray(record.suggestedBacklog);
 }
 function tasksFromRecord(record){
  return record.suggestedBacklog.slice(0,12)
   .filter(x=>x&&typeof x.title==="string"&&typeof x.suggestionId==="string"&&x.title.trim()&&x.title.length<=180&&x.suggestionId.length<=120)
   .map((x,i)=>({source_task_key:x.suggestionId,title:x.title.trim(),position:i}));
 }
 function el(tag,cls,txt){
  const e=document.createElement(tag);
  if(cls)e.className=cls;
  if(txt!==undefined)e.textContent=txt;
  return e;
 }
 function addButton(label,callback){
  const b=el("button","btn primary",label);b.type="button";b.addEventListener("click",callback);return b;
 }
 function info(message){
  const status=document.getElementById("edulegalSyncMessage");
  if(status)status.textContent=message;
 }
 async function clientContext(client){
  const {data:{user},error:userError}=await client.auth.getUser();
  if(userError||!user)throw Error("Você não está conectado a uma conta de testes. Entre como aluno e abra este livro novamente.");
  // Proteção contra trocar de conta enquanto a aba do livro permanece aberta.
  if(window.EduLegalBookLocalScope?.userId!==user.id){
   throw Error("A conta conectada mudou desde que você abriu este livro. Reabra o livro a partir da conta correta para preservar os registros de cada aluno.");
  }
  const {data:members,error:memberError}=await client.from("organization_members")
   .select("organization_id,role,approved").eq("user_id",user.id).eq("role","student").eq("approved",true);
  if(memberError)throw memberError;
  if(!members?.length)throw Error("Sua conta não possui um vínculo de aluno aprovado no ambiente de testes.");
  const orgs=members.map(m=>m.organization_id);
  const {data:students,error:studentError}=await client.from("students")
   .select("id,organization_id,active").eq("auth_user_id",user.id).in("organization_id",orgs).eq("active",true);
  if(studentError)throw studentError;
  if(students?.length!==1)throw Error(students?.length?"Há mais de uma escola ativa nesta conta de testes; é necessário escolher a escola antes de importar.":"Não foi encontrado um aluno ativo vinculado a esta conta de testes.");
  return {organization_id:students[0].organization_id,student_id:students[0].id};
 }
 async function submitToSupabase(button){
  if(sending)return;
  const record=getRecord();
  if(!isValid(record)){info("Conclua o livro para preparar seu percurso.");return;}
  if(!window.supabase){info("A biblioteca Supabase não carregou. Verifique a conexão e tente novamente.");return;}
  sending=true;button.disabled=true;
  info("Verificando sua conta de aluno no ambiente de testes...");
  try{
   const client=window.supabase.createClient(API_URL,API_KEY);
   const scope=await clientContext(client);
   const payload=subset(record);
   const bytes=new TextEncoder().encode(JSON.stringify(payload)).byteLength;
   if(bytes>60000)throw Error("Este registro está grande demais para a demonstração.");
   info("Guardando seu registro pedagógico...");
   const {error:recordError}=await client.from("learning_book_records").upsert({
    ...scope,book_id:record.bookId,book_version:record.bookVersion,
    payload,updated_at:new Date().toISOString()
   },{onConflict:"organization_id,student_id,book_id"});
   if(recordError)throw recordError;

   if(record.chosenPath){
    info("Preparando seu projeto e as tarefas no Backlog...");
    const choice=AREAS[record.chosenPath];
    const originKey="book:"+record.bookId+":"+record.chosenPath;
    const {data:proj,error:projectError}=await client.from("learning_projects").upsert({
     ...scope,origin_key:originKey,origin_book_id:record.bookId,
     area_id:choice.category,title:choice.project,updated_at:new Date().toISOString()
    },{onConflict:"organization_id,student_id,origin_key"}).select("id").single();
    if(projectError)throw projectError;
    const tasks=tasksFromRecord(record);
    if(tasks.length){
     const {error:taskError}=await client.from("learning_tasks").upsert(
      tasks.map(t=>({...scope,project_id:proj.id,...t,status:"backlog"})),
      {onConflict:"project_id,source_task_key",ignoreDuplicates:true}
     );
     if(taskError)throw taskError;
    }
   }
   info(record.chosenPath
     ?"Seu percurso foi salvo! O projeto e as tarefas estão no Backlog da sua conta de testes. Agora você decide o que fazer hoje."
     :"Seu registro foi salvo! Você pode continuar explorando e escolher um projeto quando quiser.");
   const box=document.getElementById("edulegalBookBridge");
   if(box){
    const a=el("a","btn primary","Abrir meus projetos →");
    a.href="../../index.html?view=projetos";
    box.append(a);
    button.hidden=true;
   }
  }catch(err){
   const msg=String(err?.message||"Não foi possível salvar.");
   info("Não foi possível concluir a integração: "+msg+" Você pode tentar novamente; o processo evita duplicar tarefas.");
  }finally{sending=false;button.disabled=false;}
 }
 function saveToDemo(){
  const record=getRecord();
  if(!isValid(record)){info("Conclua o livro antes de seguir.");return;}
  const choice=record.chosenPath ? AREAS[record.chosenPath]?.category : null;
  if(choice){
   const ids=tasksFromRecord(record).map((_,i)=>choice+"-"+(i+1));
   const demo={
    version:1,interests:(record.interests||[]).map(a=>AREAS[a]?.category).filter(Boolean),
    experiences:{roblox:{fixed:false,actions:[]},robotica:{actions:[]},escrita:{created:false}},
    choice,priorExperience:null,reflection:"",completedAt:new Date().toISOString(),
    plan:{today:[],later:ids,mode:"backlog-first"}
   };
   sessionStorage.setItem(OLD_DEMO_KEY,JSON.stringify(demo));
  }
  window.location.href="../../index.html?demo=1&view=projetos";
 }
 function install(){
  const record=getRecord();
  if(!record?.completed||document.getElementById("edulegalBookBridge"))return;
  const panel=el("section","panel");panel.id="edulegalBookBridge";
  panel.style.borderLeft="3px solid var(--green)";
  panel.append(el("h2","","Levar minhas descobertas para a EduLegal"));
  panel.append(el("p","",
    "Você pode guardar seu registro e preparar um projeto com as tarefas sugeridas. Elas entram no Backlog — você escolhe depois o que fará hoje."));
  const actions=el("div","row");actions.style.flexWrap="wrap";
  const send=addButton("Salvar meu percurso na minha conta de testes",()=>submitToSupabase(send));
  const demo=addButton("Experimentar no planejamento fictício",saveToDemo);
  demo.classList.remove("primary");demo.classList.add("secondary");
  actions.append(send,demo);panel.append(actions);
  const status=el("p","small","Nada é enviado automaticamente. Use apenas as contas fictícias de aluno da EduLegal de testes.");
  status.id="edulegalSyncMessage";status.setAttribute("role","status");
  panel.append(status);
  page.append(panel);
 }
 let scheduled=false;
 const observer=new MutationObserver(()=>{
  if(scheduled)return;
  scheduled=true;
  queueMicrotask(()=>{scheduled=false;install();});
 });
 observer.observe(page,{childList:true});
 install();
})();