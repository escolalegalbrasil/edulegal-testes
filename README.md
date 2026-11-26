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
- Ao concluir, uma notificação leva ao **dashboard demonstrativo**: as duas primeiras tarefas são colocadas em "Vou fazer hoje" e podem ser arrastadas ou movidas por botões em **Projetos**.
- As atividades de Arduino e Roblox deste acolhimento são **simulações no navegador**, não utilizam hardware nem o Roblox Studio real. Os livros técnicos completos são etapas posteriores.
- Dados de demonstração só ficam no `sessionStorage` da aba e só são lidos pela interface no **modo fictício** (`?demo=1`); não vinculam contas reais ou de testes, não são enviados ao Supabase e não são avaliações de autorregulação.
- Não há chat de IA, pontuação, badges concedidos, uploads ou analytics automáticos nesta versão.
