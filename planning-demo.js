"use strict";
/*
 * Planejamento demonstrativo da EduLegal.
 * ATENÇÃO: apenas para ?demo=1. Não coleta informações de alunos reais.
 * Não consulta Supabase e usa somente sessionStorage desta aba.
 * Cada projeto tem tarefas que podem vir de um livro ou de iniciativa do aluno.
 */
window.EduLegalDemoPlanning = (function () {
  const STORE="edulegal-testes-projetos-independentes-v1";
  const BOOK0_STORE="edulegal-testes-ponto-de-partida-v1";
  const STATUS=["nao_iniciada","fazendo","concluida"];
  const CHAPTER_FOR_ROBLOX=[1,2,3,4,5];
  let filter="todos";
  let feedback="";
  const el=(tag,cls,content)=>{
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(content!==undefined)node.textContent=content;
    return node;
  };
  function defaultData(){return {version:1,projects:[],bookStatus:{}};}
  function read(){
    const empty=defaultData();
    try{
      const d=JSON.parse(sessionStorage.getItem(STORE)||"null");
      if(!d||d.version!==1)return empty;
      if(Array.isArray(d.projects)){
        empty.projects=d.projects.slice(0,30).filter(p=>p&&typeof p.id==="string"&&typeof p.title==="string").map(p=>({
          id:p.id.slice(0,100),
          title:p.title.slice(0,90),
          tasks:Array.isArray(p.tasks)?p.tasks.slice(0,80).filter(t=>t&&typeof t.id==="string"&&typeof t.title==="string").map(t=>({
            id:t.id.slice(0,100),
            title:t.title.slice(0,120),
            zone:t.zone==="today"?"today":"backlog",
            status:STATUS.includes(t.status)?t.status:"nao_iniciada"
          })):[]
        }));
      }
      if(d.bookStatus&&typeof d.bookStatus==="object"){
        for(const [id,status] of Object.entries(d.bookStatus)){
          if(/^(roblox|robotica|escrita|web|pico8|video)-[1-9]\d?$/.test(id)&&STATUS.includes(status))
            empty.bookStatus[id]=status;
        }
      }
    }catch(_){}
    return empty;
  }
  function write(d){
    try{sessionStorage.setItem(STORE,JSON.stringify(d));return true;}catch(_){feedback="O navegador não pôde guardar esta alteração na aba.";return false;}
  }
  function freshId(prefix){
    return prefix+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10);
  }
  function collect(book,catalog,titles){
    const own=read();
    const rows=[];
    if(book?.completedAt&&book.choice&&Array.isArray(catalog[book.choice])){
      const choice=book.choice;
      const today=new Set(Array.isArray(book.plan?.today)?book.plan.today:[]);
      catalog[choice].forEach((name,i)=>{
        const id=choice+"-"+(i+1);
        rows.push({
          id,title:name,projectId:"book:"+choice,projectTitle:titles[choice]||"Projeto de livro",
          source:"book",zone:today.has(id)?"today":"backlog",
          status:own.bookStatus[id]||"nao_iniciada",
          chapter:choice==="roblox"?CHAPTER_FOR_ROBLOX[i]??null:null
        });
      });
    }
    own.projects.forEach(p=>p.tasks.forEach(t=>{
      rows.push({...t,projectId:p.id,projectTitle:p.title,source:"own",chapter:null});
    }));
    return {rows,projects:own.projects,bookProject:book?.completedAt&&catalog[book.choice]?{id:"book:"+book.choice,title:titles[book.choice]}:null};
  }
  function summary(book,catalog,titles){
    const data=collect(book,catalog,titles);
    return {
      ...data, all:data.rows,
      today:data.rows.filter(t=>t.zone==="today"),
      backlog:data.rows.filter(t=>t.zone==="backlog")
    };
  }
  function projectById(d,id){return d.projects.find(p=>p.id===id);}
  function taskById(d,id){
    for(const p of d.projects){
      const t=p.tasks.find(t=>t.id===id);
      if(t)return {project:p,task:t};
    }
    return null;
  }
  function addProject(title,rerender){
    const name=String(title||"").trim().slice(0,90);
    if(!name){feedback="Digite um nome curto para o projeto.";rerender();return;}
    const d=read();
    if(d.projects.length>=30){feedback="Esta demonstração já tem muitos projetos. Para criar mais, reinicie apenas os dados fictícios.";rerender();return;}
    const id=freshId("projeto");
    d.projects.push({id,title:name,tasks:[]});
    if(write(d)){filter=id;feedback="Projeto “"+name+"” criado. Agora você pode adicionar a primeira tarefa ao Backlog.";}
    rerender();
  }
  function addTask(projectId,title,rerender){
    const name=String(title||"").trim().slice(0,120);
    if(!name){feedback="Escreva uma tarefa pequena, como “Construir um cenário”.";rerender();return;}
    const d=read(),p=projectById(d,projectId);
    if(!p)return;
    if(p.tasks.length>=80){feedback="Este projeto já tem muitas tarefas na demonstração.";rerender();return;}
    p.tasks.push({id:freshId("tarefa"),title:name,zone:"backlog",status:"nao_iniciada"});
    if(write(d))feedback="Tarefa “"+name+"” adicionada ao Backlog.";
    rerender();
  }
  function changeZone(item,target,book,rerender){
    if(!["today","backlog"].includes(target))return;
    if(item.source==="book"){
      if(!book?.completedAt)return;
      const prefix=book.choice+"-";
      const ids=book.choice&&Array.isArray(book.plan?.later)&&Array.isArray(book.plan?.today)
        ?[...book.plan.today,...book.plan.later].filter(id=>id.startsWith(prefix))
        :[];
      const bookIds=ids.includes(item.id)?ids:[...ids,item.id];
      const today=Array.isArray(book.plan?.today)?book.plan.today.filter(id=>id!==item.id):[];
      if(target==="today")today.push(item.id);
      book.plan={today,later:bookIds.filter(id=>!today.includes(id)),mode:"backlog-first"};
      try{sessionStorage.setItem(BOOK0_STORE,JSON.stringify(book));}
      catch(_){feedback="Não foi possível salvar o planejamento desta tarefa.";rerender();return;}
    }else{
      const d=read(),entry=taskById(d,item.id);
      if(!entry)return;
      entry.task.zone=target;write(d);
    }
    feedback=target==="today"?"“"+item.title+"” está no seu plano de hoje.":"“"+item.title+"” voltou ao Backlog.";
    rerender();
  }
  function changeStatus(item,status,rerender){
    if(!STATUS.includes(status))return;
    const d=read();
    if(item.source==="book")d.bookStatus[item.id]=status;
    else{
      const e=taskById(d,item.id);if(!e)return;
      e.task.status=status;
    }
    if(write(d))feedback="Registro atualizado. É você quem informa o andamento; isso não significa que a habilidade foi validada.";
    rerender();
  }
  function reorder(item,delta,book,rerender){
    if(item.zone!=="today")return;
    if(item.source==="book"){
      const current=Array.isArray(book?.plan?.today)?book.plan.today.slice():[];
      const i=current.indexOf(item.id),j=i+delta;
      if(i<0||j<0||j>=current.length)return;
      [current[i],current[j]]=[current[j],current[i]];
      book.plan.today=current;
      book.plan.mode="backlog-first";
      try{sessionStorage.setItem(BOOK0_STORE,JSON.stringify(book));}catch(_){return;}
    }else{
      const d=read(),p=projectById(d,item.projectId);
      if(!p)return;
      const today=p.tasks.filter(t=>t.zone==="today");
      const i=today.findIndex(t=>t.id===item.id),j=i+delta;
      if(i<0||j<0||j>=today.length)return;
      const a=p.tasks.findIndex(t=>t.id===today[i].id),b=p.tasks.findIndex(t=>t.id===today[j].id);
      [p.tasks[a],p.tasks[b]]=[p.tasks[b],p.tasks[a]];
      write(d);
    }
    feedback="Você reorganizou a ordem de uma tarefa.";
    rerender();
  }
  function removeTask(item,rerender){
    if(item.source!=="own")return;
    if(!window.confirm("Excluir a tarefa “"+item.title+"” deste projeto fictício?"))return;
    const d=read(),p=projectById(d,item.projectId);
    if(!p)return;
    p.tasks=p.tasks.filter(t=>t.id!==item.id);
    if(write(d))feedback="Tarefa excluída desta demonstração.";
    rerender();
  }
  function removeProject(p,rerender){
    if(!window.confirm("Excluir o projeto fictício “"+p.title+"” e todas as suas tarefas?"))return;
    const d=read();
    d.projects=d.projects.filter(x=>x.id!==p.id);
    if(write(d)){filter="todos";feedback="Projeto excluído desta demonstração.";}
    rerender();
  }
  function labeledInput(text,maxLength,placeholder){
    const id=freshId("campo");
    const wrap=el("div","planner-input-group");
    const label=el("label","",text);label.htmlFor=id;
    const input=el("input","planner-input");input.id=id;input.type="text";
    input.maxLength=maxLength;input.placeholder=placeholder;input.required=true;
    wrap.append(label,input);
    return {wrap,input};
  }
  function action(label,fn,cls="soft-btn"){
    const button=el("button",cls,label);button.type="button";button.addEventListener("click",fn);return button;
  }
  function render(main,{book,catalog,titles,onRefresh}){
    const {rows,projects,bookProject}=collect(book,catalog,titles);
    if(filter!=="todos"&&filter!==bookProject?.id&&!projects.some(p=>p.id===filter))filter="todos";
    main.append(el("div","notice info","Planejar é escolher um primeiro passo, não terminar tudo hoje. Você pode começar por um livro ou criar um projeto inteiramente seu."));
    const status=el("p","meta planner-feedback",feedback);status.setAttribute("role","status");main.append(status);

    // Independência da biblioteca: o aluno cria um projeto mesmo quando nenhum livro existe.
    const create=el("section","trail-item planner-create");
    create.append(el("h2","","Tenho uma ideia de projeto"));
    create.append(el("p","meta","Seu projeto não precisa ter livro na EduLegal. Dê um nome para começar; depois escolha uma tarefa simples."));
    const form=el("form","planner-create-row");
    const {wrap,input}=labeledInput("Nome do meu projeto",90,"Ex.: Minha cidade no Roblox");
    const submit=el("button","cta","Criar meu projeto");submit.type="submit";
    form.append(wrap,submit);
    form.addEventListener("submit",event=>{event.preventDefault();const val=input.value;addProject(val,onRefresh);});
    create.append(form);main.append(create);

    if(projects.length){
      main.append(el("h2","section","Projetos que criei"));
      for(const p of projects){
        const card=el("section","trail-item planner-own-project");
        const header=el("div","planner-own-header");
        const title=el("h3","",p.title);
        const remove=action("Excluir projeto",()=>removeProject(p,onRefresh),"soft-btn planner-delete");
        header.append(title,remove);card.append(header);
        const taskForm=el("form","planner-create-row");
        const field=labeledInput("Qual é um passo pequeno para começar?",120,"Ex.: Construir a primeira rua");
        const add=el("button","cta","Adicionar ao Backlog");add.type="submit";
        taskForm.append(field.wrap,add);
        taskForm.addEventListener("submit",event=>{event.preventDefault();addTask(p.id,field.input.value,onRefresh);});
        card.append(taskForm);
        card.append(el("p","meta",p.tasks.length+" tarefa(s) registrada(s) neste projeto. Você pode organizá-las no quadro abaixo."));
        main.append(card);
      }
    }
    if(bookProject)main.append(el("p","meta","O livro sugeriu tarefas para “"+bookProject.title+"”. Elas aparecem junto das tarefas que você criou."));

    main.append(el("h2","section","Meu planejamento"));
    const filterWrap=el("div","planner-filter");
    const filterLabel=el("label","","Mostrar tarefas do projeto:");filterLabel.htmlFor="plannerFilter";
    const select=el("select","org-select");select.id="plannerFilter";
    const all=el("option","","Todos os projetos");all.value="todos";select.append(all);
    if(bookProject){const opt=el("option","",bookProject.title+" · livro");opt.value=bookProject.id;select.append(opt);}
    for(const p of projects){const opt=el("option","",p.title+" · meu projeto");opt.value=p.id;select.append(opt);}
    select.value=filter;
    select.addEventListener("change",()=>{filter=select.value;onRefresh();});
    filterWrap.append(filterLabel,select);main.append(filterWrap);

    const visible=rows.filter(t=>filter==="todos"||t.projectId===filter);
    main.append(el("p","meta","Backlog: tarefas disponíveis. Vou fazer hoje: escolhas para este momento. Arraste os cartões ou use os botões. Você pode mudar o plano quando quiser."));
    const grid=el("div","plan-grid");
    for(const zone of ["backlog","today"]){
      const col=el("section","plan-column");
      col.dataset.zone=zone;
      col.append(el("h2","",zone==="backlog"?"Backlog":"Vou fazer hoje"));
      const tasks=visible.filter(t=>t.zone===zone);
      if(!tasks.length){
        col.append(el("p","meta",zone==="today"
          ?"Seu plano começa vazio. Escolha uma tarefa do Backlog e traga para cá."
          :"Não há tarefas disponíveis aqui. Você pode criar um projeto e adicionar uma tarefa acima."));
      }
      for(const item of tasks){
        const card=el("article","plan-task");
        card.draggable=true;card.dataset.taskId=item.id;
        card.addEventListener("dragstart",ev=>{ev.dataTransfer.setData("text/plain",item.id);ev.dataTransfer.effectAllowed="move";});
        const tag=el("div","planner-task-project",item.projectTitle+(item.source==="own"?" · projeto próprio":" · livro"));
        const title=el("strong","",item.title);
        card.append(tag,title);
        const current=el("div","planner-task-state");
        const statusLabel=el("label","","Andamento:");statusLabel.htmlFor=freshId("andamento");
        const statusSelect=el("select","planner-state-select");statusSelect.id=statusLabel.htmlFor;
        for(const [value,label] of [["nao_iniciada","Ainda não comecei"],["fazendo","Estou fazendo"],["concluida","Concluí (meu registro)"]]){
          const opt=el("option","",label);opt.value=value;statusSelect.append(opt);
        }
        statusSelect.value=item.status;statusSelect.addEventListener("change",()=>changeStatus(item,statusSelect.value,onRefresh));
        current.append(statusLabel,statusSelect);card.append(current);
        if(item.status==="concluida")card.append(el("p","meta","Concluída segundo seu registro; ainda não é uma avaliação de habilidade."));
        const actions=el("div","plan-actions");
        actions.append(action(zone==="today"?"Voltar ao Backlog":"Fazer hoje",()=>changeZone(item,zone==="today"?"backlog":"today",book,onRefresh)));
        if(zone==="today"){
          actions.append(action("↑ Antes",()=>reorder(item,-1,book,onRefresh)));
          actions.append(action("↓ Depois",()=>reorder(item,1,book,onRefresh)));
        }
        if(item.source==="book"&&item.chapter!==null&&item.chapter!==undefined){
          const link=el("a","soft-btn planner-book-link","Abrir atividade no livro ↗");
          link.href="./livros/meu-primeiro-obby/?chapter="+encodeURIComponent(String(item.chapter));actions.append(link);
        }else if(item.source==="own"){
          actions.append(action("Excluir tarefa",()=>removeTask(item,onRefresh),"soft-btn planner-delete"));
        }
        card.append(actions);
        col.append(card);
      }
      col.addEventListener("dragover",ev=>{ev.preventDefault();col.classList.add("dragover");});
      col.addEventListener("dragleave",()=>col.classList.remove("dragover"));
      col.addEventListener("drop",ev=>{
        ev.preventDefault();col.classList.remove("dragover");
        const id=ev.dataTransfer.getData("text/plain");
        const item=rows.find(t=>t.id===id);
        if(item)changeZone(item,zone,book,onRefresh);
      });
      grid.append(col);
    }
    main.append(grid);
    if(!rows.length){
      const p=el("p","meta","Você ainda não possui tarefas. Pode criar um projeto acima ou começar um livro e receber sugestões de atividades.");
      main.append(p);
    }
    main.append(el("p","meta","Prévia fictícia: seu planejamento fica nesta aba do navegador. Não é salvo no Supabase nem associado a uma conta real. Os livros e suas atividades técnicas são preparados em separado."));
  }
  return {summary,render,load:read,storeKey:STORE};
})();
