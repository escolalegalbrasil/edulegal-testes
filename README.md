# EduLegal — Ambiente de Testes

Este repositório contém uma **versão experimental da plataforma EduLegal**, separada da versão oficial utilizada pelos alunos.

## Finalidade
- Avaliar a nova identidade visual EduLegal, com temas claro e escuro.
- Testar navegação, login e permissões de diretor, professor e aluno.
- Validar futuramente os livros interativos, editor integrado e moderação de conversas.

## Atenção
**Este não é o ambiente oficial.** O aplicativo conecta exclusivamente ao banco de testes `edulegal-testes` no Supabase, utilizando apenas sua chave pública. Todos os testes devem utilizar contas fictícias, nunca dados pessoais de alunos reais.

O modo **Explorar a interface sem login** usa dados demonstrativos.

Em 25/11/2026, **seis contas fictícias do Supabase Auth foram criadas e confirmadas** e associadas a duas escolas, com dois diretores, dois professores e dois alunos. As verificações de RLS com identidades simuladas passaram. **A validação de login real no navegador ainda depende do diretor**, utilizando as senhas que ele definiu.

O ambiente oficial permanece em [escolalegalbrasil/edulegal](https://github.com/escolalegalbrasil/edulegal) e só receberá alterações após testes e aprovação expressa do diretor.

## Arquivos
- `index.html` — entrada da nova interface.
- `styles.css` — estilos e paletas aprovados.
- `app.js` — navegação, demonstração e conexão exclusiva ao banco de testes.
- `painel-acessos.html` — verificação das permissões com contas fictícias.

## Publicação
O GitHub informa que o **Pages está habilitado**. Se o site não abrir, conferir em **Settings → Pages** a origem: branch `main`, pasta `/(root)`.

Endereço previsto do laboratório:
https://escolalegalbrasil.github.io/edulegal-testes/

Consulte [TESTE-LOGIN.md](TESTE-LOGIN.md) para o roteiro de teste com os seis perfis.

## Percurso piloto: Acolhimento → Primeiro Obby

- [Abrir o protótipo em HTML (código)](experimentos/percurso-bro/index.html)
- [Ler a especificação pedagógica](docs/percurso-piloto-acolhimento-obby.md)
- Nesta primeira versão, há acolhimento com escolhas concretas, planejamento diário por tarefas arrastáveis (com alternativa por botões), uma amostra das missões de Roblox e rascunho de portfólio.
- **É apenas uma demonstração**: não está integrada a contas, IA, analytics, livro completo, upload ou concessão de badges. O protótipo guarda escolhas somente nesta sessão do navegador.
- Não usar dados reais. A versão de produção da EduLegal não foi alterada.

## Livro 0 — Ponto de Partida (protótipo interativo)

- [Abrir Livro 0 no site de testes](https://escolalegalbrasil.github.io/edulegal-testes/livros/ponto-de-partida/)
- [Ver arquivos do livro](livros/ponto-de-partida/index.html)
- Cinco capítulos: boas-vindas, áreas da EduLegal, microexperiências práticas (Roblox/LED virtual/escrita), escolha inicial e tarefas sugeridas.
- Ao concluir, uma notificação leva ao **dashboard demonstrativo**: **todas as tarefas surgem no Backlog**. O aluno decide quais levar a **Vou fazer hoje** e pode colocar tarefas declaradas concluídas em **Já terminei**, arrastando ou utilizando botões em **Projetos**.
- As atividades de Arduino e Roblox deste acolhimento são **simulações no navegador**, não utilizam hardware nem o Roblox Studio real. Os livros técnicos completos são etapas posteriores.
- Dados de demonstração só ficam no `sessionStorage` da aba e só são lidos pela interface no **modo fictício** (`?demo=1`); não vinculam contas reais ou de testes, não são enviados ao Supabase e não são avaliações de autorregulação.
- Não há chat de IA, pontuação, badges concedidos, uploads ou analytics automáticos nesta versão.


## Livro 1 — Meu Primeiro Obby (protótipo interativo)

- [Abrir o Livro 1 no ambiente de testes](https://escolalegalbrasil.github.io/edulegal-testes/livros/meu-primeiro-obby/)
- [Ver os arquivos do livro](livros/meu-primeiro-obby/index.html)
- Nove capítulos: apresentação, interface do Studio, Part/Anchored, percurso e testes, Transparency/CanCollide, código incremental, loop de aparecer/desaparecer, investigação de bugs, conclusão reflexiva.
- Três modos de apoio: **Passo a passo**, **Dicas quando precisar** e **Mais independente**. O modo muda apenas o tipo de orientação, não o objetivo nem o valor do aluno.
- **Editor Luau de apoio**, com quatro microdesafios: identificar a Part, desaparecer, reaparecer, repetir usando while true do com task.wait. A conferência verifica somente trechos do texto: não executa Luau; o teste real acontece no Roblox Studio.
- A imagem da interface da missão 1 é da documentação oficial Roblox. Outras figuras são esquemas e simulações locais, sem pretensão de simular o motor Roblox.
- Campos para reflexão, prévia de print local (não enviada ou salva), rascunho de projeto e próximo desafio. O rascunho aparece no Portfólio em **modo demonstração**, sem conferir domínio e sem conceder badges automaticamente.
- Sem conexão de dados com Supabase/IA, sem pesquisa ou coleta de dados reais; usa somente sessionStorage por aba e deve ser testado com personagens fictícios.
- Para limpar apenas as respostas do Livro 1, usar **Reiniciar somente este livro** no rodapé do livro. A EduLegal oficial não foi alterada.

## Plataforma: navegação e planejador (26/11/2026)

- O menu principal de testes agora contém **Início**, **Meus livros**, **Projetos** e **Portfólio**. **Mentoria saiu do menu**, sem exclusão de tabelas, dados históricos ou funções da produção.
- Sem tarefas, o dashboard oferece dois caminhos: **Explorar meus livros** ou **Planejar meu próprio projeto**. Com tarefas, destaca o planejamento e mantém a biblioteca acessível.
- A página Projetos permite **criar projetos e tarefas sem livro** e gerenciar tarefas em **Backlog → Vou fazer hoje → Já terminei**. A terceira coluna representa conclusão *declarada pelo aluno*, não domínio validado ou concessão de badges.
- Tarefas podem ser arrastadas ou movidas por botões; uma tarefa terminada pode ser retomada. Os dados são **somente demonstração em sessionStorage**, ainda não associados ao Supabase de testes.
- **O Livro 1 existente é rascunho temporário**, a serem recriados em conversa específica para livros. Nesta etapa, não alteramos conteúdo pedagógico; apenas uma ligação técnica provisória para abrir capítulos do Obby foi adicionada anteriormente. Os vínculos aos livros atuais serão substituídos pelo futuro contrato de integração.

## Biblioteca por áreas (26/11/2026)

- **Minhas explorações** (Início) e **Meus livros** agora abrem páginas distintas para **Roblox Studio**, **Robótica e Arduino**, **Sites e programação**, **Escrita criativa**, **Jogos 2D — PICO-8** e **Vídeo e animação**.
- Rotas internas próprias, por exemplo: `?demo=1&view=categoria&area=roblox` e `?demo=1&view=categoria&area=robotica`. A biblioteca é o ponto de retorno; não é preciso duplicar arquivos HTML por categoria.
- Catálogo inicial centralizado em `LEARNING_AREAS` e `BOOK_CATALOG` do `app.js`, preparado para receber novos livros após revisão. As áreas sem material mostram uma mensagem clara; **Meu Primeiro Obby** aparece apenas em Roblox, marcado como protótipo antigo.
- **Ponto de Partida** permanece destacado na biblioteca geral como acolhimento, também rotulado como protótipo. Ambos os livros serão recriados em outra conversa e **não tiveram seu conteúdo editado nesta etapa**.
- Tudo foi alterado somente no repositório de testes. A plataforma de produção e o banco de produção permanecem intocados.

## Livro 0 conectado ao Supabase de testes (26/11/2026)

- O **novo Ponto de Partida enviado pelo diretor** está publicado em [livros/ponto-de-partida/](livros/ponto-de-partida/index.html), com uma ponte de integração opcional. O conteúdo antigo dessa pasta foi substituído em testes; os scripts antigos `book.js` e `style.css` não são utilizados por esse HTML autocontido.
- Entrar na plataforma com a conta **fictícia de aluno A ou B**, abrir o livro, concluir e clicar em **Salvar meu percurso na minha conta de testes**. Isso grava um resumo do registro em `learning_book_records`, um projeto em `learning_projects` e tarefas em `learning_tasks`, **todas inicialmente no Backlog**. O aluno escolhe o que irá fazer hoje.
- O envio é repetível sem duplicar tarefas existentes ou redefinir tarefas já movidas. A página Projetos agora usa Supabase para contas de aluno autenticadas, e demonstração local para visitantes fictícios sem login.
- RLS testado por SQL com aluno A, aluno B e diretor A, usando transações revertidas. **Ainda é necessário testar o fluxo completo no navegador com as contas fictícias.** Não usar dados reais.
- Veja o [roteiro e limitações da integração](docs/integracao-livro0-supabase-testes.md). A EduLegal oficial permanece intacta.
