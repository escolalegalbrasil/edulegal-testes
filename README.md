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
