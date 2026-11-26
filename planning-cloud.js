"use strict";
/* EduLegal TESTES: projetos vinculados ao aluno autenticado.
 * As políticas RLS de learning_* impedem escrita/leitura por outro aluno.
 * Não usa localStorage/sessionStorage para dados pedagógicos autenticados.
 */
window.EduLegalCloudPlanning=(function(){
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const iso=()=>new Date().toISOString();
 const uuid=()=>crypto.randomUUID();
 let selectedFilter="all";
 function notice(main,text){main.append(el("div","notice info",text));}
 function action(label,fn,cls="soft-btn"){
  const b=el("button",cls,label);b.type="button";b.addEventListener("click",fn);return b;
 }
 function field(title,placeholder,limit=120){
  const wrap=el("div","planner-input-group");
  const label=el("label","",title);
  const input=el("input","planner-input");
  input.type="text";input.id="campo-"+uuid();input.maxLength=limit;input.placeholder=placeholder;input.required=true;
  label.htmlFor=input.id;wrap.append(label,input);return {wrap,input};
 }
 async function context(client,userId,orgId){
  const {data:students,error}=await client.from("students").select("id,organization_id,auth_user_id")
   .eq("auth_user_id",userId).eq("organization_id",orgId).eq("active",true).limit(2);
  if(error)throw error;
  if(students?.length!==1)throw Error("Esta conta não está vinculada a um aluno ativo da escola selecionada.");
  return {organization_id:orgId,student_id:students[0].id};
 }
 async function load(client,userId,orgId){
  const scope=await context(client,userId,orgId);
  const [p,t]=await Promise.all([
   client.from("learning_projects").select("id,origin_key,origin_book_id,area_id,title,created_at").eq("organization_id",orgId).eq("student_id",scope.student_id).order("created_at",{ascending:true}),
   client.from("learning_tasks").select("id,project_id,source_task_key,title,status,position,created_at").eq("organization_id",orgId).eq("student_id",scope.student_id).order("position",{ascending:true}).order("created_at",{ascending:true})
  ]);
  if(p.error)throw p.error;
  if(t.error)throw t.error;
  const projects=p.data||[];
  const byId=Object.fromEntries(projects.map(x=>[x.id,x]));
  const rows=(t.data||[]).filter(x=>byId[x.project_id]).map(x=>({...x,project:byId[x.project_id]}));
  return {scope,projects,rows,
   today:rows.filter(t=>t.status==="today"),
   backlog:rows.filter(t=>t.status==="backlog"),
   done:rows.filter(t=>t.status==="done"),
   all:rows
  };
 }
 async function render(main,{client,userId,orgId,onChanged}){
  const wrapper=el("div","cloud-planner");
  main.append(wrapper);
  wrapper.append(el("p","meta","Carregando seus projetos desta conta de testes..."));
  let data;
  try{data=await load(client,userId,orgId);}catch(err){wrapper.replaceChildren();notice(wrapper,"Não foi possível carregar seus projetos: "+err.message);return;}
  if(!main.isConnected)return;
  const {scope,projects,rows}=data;
  wrapper.replaceChildren();
  notice(wrapper,"Este é seu planejamento pessoal. As tarefas sugeridas pelos livros entram no Backlog; você escolhe o que fará hoje. Projetos próprios também são bem-vindos.");
  const status=el("p","meta planner-feedback");status.setAttribute("role","status");wrapper.append(status);
  const refresh=async(message)=>{
   if(message)status.textContent=message;
   await onChanged();
  };
  const invoke=async(fn)=>{
   try{await fn();await refresh();}
   catch(err){status.textContent="Não foi possível salvar a alteração: "+String(err.message||err);}
  };
  // Projeto autoral sem livro.
  const own=el("section","trail-item planner-create");
  own.append(el("h2","","Tenho uma ideia de projeto"));
  own.append(el("p","meta","Crie um projeto mesmo que ainda não exista um livro relacionado."));
  const f=el("form","planner-create-row");
  const t=field("Nome do projeto", "Ex.: Meu robô com olhos animados",100);
  const submit=el("button","cta","Criar projeto");submit.type="submit";f.append(t.wrap,submit);
  f.addEventListener("submit",e=>{e.preventDefault();const name=t.input.value.trim();
   if(!name){status.textContent="Escreva o nome do projeto.";return;}
   invoke(async()=>{
    const {error}=await client.from("learning_projects").insert({
      ...scope,origin_key:"own:"+uuid(),title:name,updated_at:iso()
    });if(error)throw error;
   });
  });
  own.append(f);wrapper.append(own);
  if(projects.length){
   wrapper.append(el("h2","section","Meus projetos"));
   const ownProjects=projects.filter(p=>!p.origin_book_id);
   for(const p of ownProjects){
    const card=el("section","trail-item planner-own-project");
    const title=el("h3","",p.title);card.append(title);
    const form=el("form","planner-create-row");
    const entry=field("Nova tarefa para este projeto","Ex.: montar o primeiro circuito");
    const add=el("button","cta","Adicionar ao Backlog");add.type="submit";form.append(entry.wrap,add);
    form.addEventListener("submit",e=>{e.preventDefault();const name=entry.input.value.trim();
     if(!name){status.textContent="Escreva uma tarefa pequena.";return;}
     invoke(async()=>{
      const {error}=await client.from("learning_tasks").insert({
       ...scope,project_id:p.id,source_task_key:"own:"+uuid(),title:name,status:"backlog",updated_at:iso()
      });if(error)throw error;
     });
    });
    card.append(form);wrapper.append(card);
   }
  }
  if(projects.some(p=>p.origin_book_id))wrapper.append(el("p","meta","Tarefas sugeridas pelos livros também aparecem neste quadro. Nenhuma delas foi escolhida automaticamente para hoje."));
  wrapper.append(el("h2","section","Meu planejamento"));
  const filters=el("div","planner-filter");
  const label=el("label","","Mostrar projeto:");label.htmlFor="cloudProjectFilter";
  const select=el("select","org-select");select.id="cloudProjectFilter";
  for(const [id,name] of [["all","Todos os projetos"],...projects.map(p=>[p.id,p.title+(p.origin_book_id?" · livro":" · meu projeto")])]){
   const option=el("option","",name);option.value=id;select.append(option);
  }
  if(selectedFilter!=="all"&&!projects.some(p=>p.id===selectedFilter))selectedFilter="all";
  select.value=selectedFilter;select.addEventListener("change",()=>{selectedFilter=select.value;wrapper.querySelectorAll("[data-project-id]").forEach(n=>n.hidden=selectedFilter!=="all"&&n.dataset.projectId!==selectedFilter);});
  filters.append(label,select);wrapper.append(filters);
  wrapper.append(el("p","meta","Backlog → Vou fazer hoje → Já terminei. Você pode arrastar ou utilizar os botões. A conclusão é um registro seu, não uma avaliação de habilidades."));
  const grid=el("div","plan-grid");
  const change=async(task,target)=>{
   if(task.status===target)return;
   const {error}=await client.from("learning_tasks").update({status:target,updated_at:iso()})
    .eq("id",task.id).eq("organization_id",scope.organization_id).eq("student_id",scope.student_id);
   if(error)throw error;
  };
  for(const zone of ["backlog","today","done"]){
   const col=el("section","plan-column");col.dataset.zone=zone;
   col.append(el("h2","",zone==="backlog"?"Backlog":zone==="today"?"Vou fazer hoje":"Já terminei"));
   const subset=rows.filter(x=>x.status===zone);
   if(!subset.length)col.append(el("p","meta",zone==="backlog"?"Não há tarefas neste espaço.":zone==="today"?"Escolha uma tarefa para seu dia.":"As tarefas que você concluir poderão aparecer aqui."));
   for(const task of subset){
    const card=el("article","plan-task");card.draggable=true;card.dataset.projectId=task.project_id;
    card.hidden=selectedFilter!=="all"&&selectedFilter!==task.project_id;
    card.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",task.id);e.dataTransfer.effectAllowed="move";});
    card.append(el("div","planner-task-project",task.project.title+(task.project.origin_book_id?" · livro":" · projeto próprio")));
    card.append(el("strong","",task.title));
    if(zone==="done")card.append(el("p","meta","Concluída segundo seu registro; pode ser retomada."));
    const actions=el("div","plan-actions");
    if(zone==="backlog")actions.append(action("Fazer hoje",()=>invoke(()=>change(task,"today"))));
    else if(zone==="today"){
     actions.append(action("Já terminei ✓",()=>invoke(()=>change(task,"done"))));
     actions.append(action("Voltar ao Backlog",()=>invoke(()=>change(task,"backlog"))));
    }else{
     actions.append(action("Voltar a fazer",()=>invoke(()=>change(task,"today"))));
     actions.append(action("Voltar ao Backlog",()=>invoke(()=>change(task,"backlog"))));
    }
    if(task.project.origin_book_id){
     const link=el("a","soft-btn planner-book-link","Revisitar meu livro ↗");
     link.href="./livros/ponto-de-partida/";
     actions.append(link);
    }
    card.append(actions);col.append(card);
   }
   col.addEventListener("dragover",e=>{e.preventDefault();col.classList.add("dragover");});
   col.addEventListener("dragleave",()=>col.classList.remove("dragover"));
   col.addEventListener("drop",e=>{
    e.preventDefault();col.classList.remove("dragover");
    const id=e.dataTransfer.getData("text/plain");
    const task=rows.find(t=>t.id===id);
    if(task)invoke(()=>change(task,zone));
   });
   grid.append(col);
  }
  wrapper.append(grid);
  if(!rows.length)wrapper.append(el("p","meta","Você ainda não tem tarefas. Explore um livro ou crie seu próprio projeto."));
  wrapper.append(el("p","meta","Registros persistidos no Supabase de testes, associados à sua conta de aluno e protegidos por RLS. Não utilize dados pessoais reais neste laboratório."));
 }
 return {load,render};
})();