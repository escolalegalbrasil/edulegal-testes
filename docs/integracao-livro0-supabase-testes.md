# EduLegal — Integração do Livro 0 com a plataforma (testes, 26/11/2026)

## Situação
A versão **enviada pelo diretor** do Livro 0 — Ponto de Partida substituiu o rascunho anterior em `livros/ponto-de-partida/index.html`. O HTML pedagógico foi preservado; somente a chave local, textos de transparência e scripts de integração foram ajustados. **Não alteramos a produção.**

## Como o aluno utiliza
1. Abrir a EduLegal de testes usando **uma conta fictícia de aluno** aprovada no Supabase do laboratório.
2. Entrar em **Meus livros → Ponto de Partida**; realizar experiências, escolher o primeiro projeto e concluir.
3. Na tela de conclusão, selecionar **Salvar meu percurso na minha conta de testes**. O envio é **intencional**, não automático.
4. A plataforma verifica o aluno autenticado, grava um resumo pedagógico em `learning_book_records`, cria/atualiza o projeto em `learning_projects` e inclui as sugestões em `learning_tasks` como **backlog** (nunca seleciona “Vou fazer hoje”).
5. O botão **Abrir meus projetos** leva à página Projetos da mesma conta. O aluno pode mover tarefas entre **Backlog → Vou fazer hoje → Já terminei** e também criar seus projetos e tarefas sem livro.
6. Enviar novamente o mesmo percurso **não duplica** o projeto nem as tarefas e não redefine o estado de tarefas já existentes.

## Fluxo sem login
Há a opção **Experimentar no planejamento fictício**, que transfere sugestões para o planejador de demonstração com armazenamento temporário na aba. **Isso não persiste no Supabase** nem constitui trabalho de um aluno autenticado.

## Registros pedagógicos
O livro fornece `window.EduLegalPontoDePartida.getRecord()`, com `bookId`, `bookVersion`, `chosenPath`, `suggestedBacklog`, `interests`, `priorKnowledge` e experiências. A ponte envia só um **resumo delimitado**, incluindo reflexões opcionais e níveis de dicas. Não envia os eventos brutos, cronômetros ou log integral do comportamento. Nenhuma análise por IA acontece neste estágio.

As áreas do livro são normalizadas para a plataforma: `robotics→robotica`, `writing→escrita`, `animation→video`; `roblox`, `web` e `pico8` permanecem iguais.

## Segurança e contas compartilhadas
- Três tabelas novas de testes com RLS: `learning_book_records`, `learning_projects`, `learning_tasks`.
- As quatro policies por tabela permitem SELECT/INSERT/UPDATE/DELETE **somente ao próprio aluno ativo com vínculo aprovado**, sem acesso anônimo; não são concedidos automaticamente privilégios a professor ou diretor.
- Chave de armazenamento do livro local é separada por conta autenticada, com preflight; o envio verifica se a conta ainda é a mesma.
- As operações usam **somente chave publicável** do projeto de testes. Não usar dados reais de crianças neste laboratório.
- Um computador compartilhado precisa testar também o fluxo real de sair e entrar com contas diferentes. O isolamento lógico já foi testado por SQL com identidades simuladas e `ROLLBACK`; o fluxo completo do navegador ainda precisa de validação humana.

## Validações efetuadas
- Tabelas criadas com RLS e 12 policies de proprietário; advisor não apontou RLS desligado.
- Testes SQL transacionais: aluno A lê seu projeto, tarefas e registro; aluno B não vê o registro A nem consegue inserir em nome de A; diretor A não tem acesso às tabelas novas no momento. Tudo revertido ao final.
- Revisão estática da estrutura/sintaxe e presença dos scripts/rotas realizada; **não afirmar que o envio autenticado em navegador foi testado até o diretor executar esse roteiro**.

## Limitações atuais
- O registro salvo pode ser uma declaração do aluno; não equivale a domínio verificado.
- A análise por IA, badges, portfólio com evidências e relatórios automáticos virão depois.
- Os registros dos novos livros usarão um contrato de integração versionado; esta é a primeira implementação do Livro 0.
- Ainda não implementamos escolha entre múltiplas escolas para um mesmo aluno; o envio informa quando houver mais de uma vinculação ativa.
- Os arquivos antigos `livros/ponto-de-partida/book.js` e `style.css` foram mantidos por histórico, mas o HTML novo é autocontido e não os carrega.

## Próximos passos
Validar login com as duas contas fictícias de aluno, concluir o livro, salvar no banco, conferir Projetos e alternar as contas no mesmo navegador. Somente depois ampliar para upload de evidências e relatórios de aprendizagem.
