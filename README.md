# EduLegal — Ambiente de Testes

Este repositório contém uma **versão experimental da plataforma EduLegal**, separada da versão oficial utilizada pelos alunos.

## Finalidade
- Avaliar a nova identidade visual EduLegal, com temas claro e escuro.
- Testar navegação, login e permissões de diretor, professor e aluno.
- Validar futuramente os livros interativos, editor integrado e moderação de conversas.

## Atenção
**Este não é o ambiente oficial.** O aplicativo conecta exclusivamente ao banco de testes `edulegal-testes` no Supabase, utilizando apenas sua chave pública. Todos os testes devem utilizar contas fictícias, nunca dados pessoais de alunos reais.

O modo **Explorar a interface sem login** usa dados demonstrativos.

Os testes completos de login e permissões ainda dependem da criação das contas fictícias no Supabase Auth.

O ambiente oficial permanece em [escolalegalbrasil/edulegal](https://github.com/escolalegalbrasil/edulegal) e só receberá alterações após testes e aprovação expressa do diretor.

## Arquivos
- `index.html` — entrada da nova interface.
- `styles.css` — estilos e paletas aprovados.
- `app.js` — navegação, demonstração e conexão exclusiva ao banco de testes.
- `painel-acessos.html` — verificação das permissões com contas fictícias.

## Publicação
Para ativar o site: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

Endereço esperado quando publicado:
https://escolalegalbrasil.github.io/edulegal-testes/
