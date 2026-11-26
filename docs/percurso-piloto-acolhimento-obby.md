# Percurso piloto — Acolhimento → Primeiro Obby (EduLegal)

**Status (25/11/2026):** percurso em protótipos funcionais no repositório de testes: Livro 0 (`livros/ponto-de-partida/`) e Livro 1 de Roblox (`livros/meu-primeiro-obby/`). Ambos requerem revisão pedagógica e teste completo no navegador e no Roblox Studio. Nenhum relatório de IA, ponto real ou badge validado foi implementado.

## Objetivo pedagógico
Promover a autorregulação da aprendizagem, motivando o aluno a criar projetos ligados aos seus interesses, desenvolver habilidades técnicas e socioemocionais, apropriar-se dos conhecimentos necessários à realização dos projetos e tornar-se consciente das próprias habilidades e dificuldades.

## Livro 0 — Acolhimento
1. Boas-vindas curtas; explicar que o aluno pode descobrir e mudar seus interesses.
2. Mostrar áreas em cartões concretos com exemplos de projetos (Roblox Studio, robótica, desenvolvimento web, escrita criativa etc.).
3. Pequenas escolhas e demonstrações práticas intercaladas com perguntas simples; **evitar perguntas abstratas sobre personalidade ou estilo**.
4. Escolher um primeiro percurso (exemplo fictício: Roblox Studio).
5. Planejamento inicial assistido: a EduLegal apresenta tarefas concretas relacionadas ao percurso escolhido. **Todas entram primeiro no Backlog**; o aluno escolhe quais levar para **Vou fazer hoje** (inicialmente vazia), podendo reorganizar, trocar ou apenas explorar.
6. Nunca inferir personalidade, emoção, motivação ou autorregulação a partir de uma única escolha. Registros iniciais são hipóteses pedagógicas provisórias.

## Princípio transversal de sequenciamento didático

**Começar pelo mais geral e fácil; aprofundar progressivamente**, sempre com referência a objetos e experiências concretas. No Roblox Studio: apresentar o ambiente antes das ferramentas; mostrar uma Part no mundo 3D antes de explicar a lista do Explorer; selecionar a mesma Part antes de apresentar suas Properties; só perguntar depois de ensinar, mostrar e experimentar. Não exigir que o aluno responda sobre conceitos, objetos ou janelas ainda não apresentados. Preservar uma retomada guiada para alunos que precisarem, sem rotular o aluno.

## Livro 1 — Meu Primeiro Obby
As tarefas exemplificam aprendizagens concretas:
- reconhecer Explorer, Propriedades, Move, Scale, Rotate e Play;
- inserir uma `Part`, configurar `Anchored`, `Size`, `Position`, cores e materiais;
- construir e testar um pequeno percurso;
- investigar `Transparency` e `CanCollide` manualmente;
- escrever poucas linhas de Luau por vez, entendendo `Script`, `script.Parent`, propriedades e `task.wait`;
- fazer uma plataforma aparecer e desaparecer em intervalos, com teste e reflexão;
- escolher uma expansão autoral.

Adotar o padrão Entenda → Experimente → Observe → Confira, pistas graduais, primeiro tentativa e testes no Roblox Studio. A IA não será um chat obrigatório; ajudar a depurar via IA somente como último recurso.

## Planner diário: integração com livro e projeto
Princípio: **o aluno não precisa saber formular metas sobre conteúdos que desconhece**. O livro oferece possibilidades concretas e progressivamente transfere responsabilidade do planejamento.

- A unidade de planejamento é uma **tarefa pequena de projeto**, vinculada a uma missão do livro e a um conhecimento/habilidade.
- No começo do encontro: exibir cartões com ações observáveis, por exemplo: “Criar uma plataforma”; “Testar se consigo saltar”; “Observar o que muda em Transparency”.
- A página **Projetos** apresenta **três colunas**, nesta ordem: **Backlog** (tarefas disponíveis), **Vou fazer hoje** (tarefas selecionadas pelo aluno) e **Já terminei** (tarefas que o aluno declara ter concluído). O aluno move por arrastar ou botões. Pode devolver uma tarefa concluída para Hoje ou Backlog.
- A ordem do plano determina a ordem de apresentação de sugestões, sem bloquear explorações espontâneas ou exigir conclusão.
- Ao executar uma tarefa, abrir a missão correspondente do livro. Ao voltar, registrar tentativa, teste, dificuldades e eventual evidência enviada; o cartão guarda estado (não iniciado, experimentando, concluído pelo aluno, conferido).
- Para iniciantes, sugerir um conjunto pequeno de tarefas concretas e orientar como escolher, **sem preencher automaticamente o plano do dia**. Para alunos mais autônomos, permitir escolher/criar mais tarefas. Direção é dinâmica por atividade, não rótulo da criança.
- A conclusão de uma tarefa é uma declaração/registro do aluno até ser confrontada com evidências; **não é inferência automática de domínio**.

## Regra de UX: um único planejamento, livros como mediação

O planejamento é um recurso **da aba Projetos**, não uma segunda lista criada nos livros. Os livros **ensinam a planejar com experiências concretas**, sugerem tarefas e ajudam a revisar decisões; não mantêm um quadro independente.

- **Início** mostra um resumo do planejamento. **Sem tarefas**, oferece **dois botões**: explorar livros **e** planejar um projeto próprio. Com tarefas, enfatiza Projetos, mas mantém a biblioteca acessível. O botão principal nunca abre Mentoria.
- **Meus livros** apresenta possibilidades e conteúdos; ao escolher um percurso, as tarefas sugeridas passam para o Backlog de Projetos, ainda não selecionadas para o dia.
- **Projetos** é a fonte única para escolher e reorganizar tarefas em **Backlog → Vou fazer hoje → Já terminei**. O aluno também pode criar um **projeto próprio, mesmo sem livro**, adicionar tarefas ao Backlog, mover ou reabrir tarefas e filtrar por projeto. A edição do plano fica aqui.
- **Dentro do livro**, oferecer apenas contexto curto da tarefa atual, pistas e perguntas concretas de previsão/teste/reflexão; o livro pode sugerir um novo passo e vincular a tarefa ao Backlog, mas **não abre outro planner dentro do livro**.
- **Depois de uma atividade**, o aluno pode registrar o que fez e como verificou; os registros atualizam o mesmo objeto de tarefa e alimentam relatórios. A conclusão no planejamento é uma declaração do aluno, não comprovação automática de competência.
- **Na volta à plataforma**, oferecer retomar uma tarefa do plano ou revisá-lo; não impor metas abstratas, não exigir terminar tudo em uma sessão e permitir mudança de ideia.
- No protótipo atual, as tarefas fictícias do Livro 0 aparecem no Backlog, projetos próprios podem ser criados, cartões passam por três colunas e registram conclusão declarada, com retorno possível. O Livro 1 antigo ainda é **rascunho demonstrativo** e seu vínculo a tarefas é provisório: os livros serão recriados e a ligação por atividade será refeita com um padrão de integração estável. Persistência por aluno depende do Supabase de testes.

## Três modos inicialmente previstos
Guiado, Acompanhado, Exploratório. Todos preservam objetivos nucleares e sequências técnicas verificadas, mas ajustam quantidade de orientação e oportunidades de escolha. O aluno pode solicitar mais direção; a transição acontece entre etapas conforme evidências e decisão pedagógica.

## Registro de aprendizagem, sem vigilância excessiva
Coletar apenas o necessário e distinguindo observação de hipótese:
- tarefa vinculada, data, atividade e versão;
- plano inicial e alterações feitas pelo aluno;
- dica opcional aberta (não interpretar isoladamente);
- hipótese e teste voluntariamente registrados;
- situação da tarefa declarada pelo aluno;
- entrega opcional de print/código e reflexão;
- evidências e critérios de habilidade, não só pontos.
Não interpretar ausência de clique, tempo bruto ou quantidade de dicas como diagnóstico/medida de autorregulação.

## Relatório por atividade
Emitido ao concluir uma etapa do livro, com:
- objetivo, conhecimento trabalhado e evidências;
- planejamento, monitoramento, revisão, solicitação de apoio e reflexão **quando observáveis**;
- descrição do progresso e próximos desafios possíveis, com grau de confiança e limitações.
IA analisa nos bastidores; professor/diretor revisa quando necessário.

## Badges e portfólio
- Pontos **internos**, jamais exibidos ao aluno; não usar contagem para pressão por recompensa.
- Badges descritivos com níveis de complexidade e critérios de evidência; não concedidos automaticamente somente por completar páginas.
- **Sim, projeto e badges aparecerão no portfólio**, mas o projeto deve ser selecionado/organizado pelo aluno e a publicação externa exige revisão e autorização adequadas.
- Portfolio pode ter título, imagens/prints, descrição, o que aprendeu, como resolveu um desafio, conhecimentos e conquistas validadas.
- Badges socioemocionais sem pontuação numérica; registros contextuais, participação voluntária e mediação humana.

## Marcos de implementação
A. Protótipo com três colunas em Projetos (Backlog, Vou fazer hoje, Já terminei), criação de projetos próprios e tarefas fictícias, sem IA, coleta real nem banco de produção.
B. Livros demonstrativos de acolhimento + Obby elaborados, com três modos de orientação; **testes com alunos e no Roblox Studio pendentes**.
C. Registro estruturado no Supabase **de testes**; autoria e isolamento de escola/aluno por RLS.
D. Entrega de prints com consentimento e segurança; relatório por atividade.
E. Regras de avaliação de badges com evidências; montagem do portfólio.
F. Avaliação do diretor e dos alunos em piloto supervisionado.

**A produção permanece intocada até autorização expressa do diretor.**
