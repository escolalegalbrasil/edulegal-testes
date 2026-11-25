# EduLegal — Teste de login e permissões (ambiente fictício)

**Ambiente exclusivamente de testes.** Não usar contas, senhas nem dados de alunos reais. Nenhuma mudança foi feita na EduLegal oficial.

## Status confirmado em 25/11/2026
- Projeto Supabase: `edulegal-testes`.
- 6 usuários Auth cadastrados e com e-mails confirmados.
- 6 perfis e 6 vínculos institucionais aprovados: diretor, professor e aluno das escolas fictícias A e B.
- 2 professores atribuídos a 2 alunos fictícios, um de cada escola.
- Teste de RLS por **identidades simuladas** para os seis perfis e identidade sem vínculo: passou.
- GitHub Pages está ativado no repositório de testes.
- **Ainda faltam** testes de login via navegador, fluxos de moderação, convites reais e painel administrativo completo.

## Como testar no navegador
1. Abra https://escolalegalbrasil.github.io/edulegal-testes/
2. Use **um dos e-mails de teste abaixo e a senha de teste correspondente** criada no Supabase Auth. Não compartilhe a senha no chat.
3. Ao entrar, confira o tema, os menus e o contexto da organização.
4. Acesse a opção **Painel da escola** (diretor e professor) e abra o verificador de permissões para comparar os dados visíveis.

| Perfil | E-mail fictício | Esperado |
|---|---|---|
| Diretor da Escola A | `teste-diretor-a@example.com` | Uma escola (A), 1 aluno, 1 professor, 1 mentoria, 1 alerta fictício |
| Professor da Escola A | `teste-professor-a@example.com` | Apenas aluno associado da escola A, sem dados da escola B |
| Aluno da Escola A | `teste-aluno-a@example.com` | Apenas sua mentoria da escola A; nenhum alerta de moderação |
| Diretor da Escola B | `teste-diretor-b@example.com` | Apenas registros da escola B |
| Professor da Escola B | `teste-professor-b@example.com` | Apenas aluno associado da escola B |
| Aluno da Escola B | `teste-aluno-b@example.com` | Apenas sua mentoria da escola B; nenhum alerta de moderação |

O conteúdo real dos chats não aparece nessa versão; o verificador consulta somente metadados e contagens. **Painel da escola** ainda é um esboço, não o painel definitivo de moderação e cadastro.

## Atenção
- Caso o login falhe, confira **e-mail, senha e e-mail confirmado** em `edulegal-testes` → Authentication → Users; não altere o projeto oficial.
- Se surgir acesso inesperado entre escolas, interrompa os testes, não use dados reais e comunique o resultado.
- O teste de RLS em PostgreSQL não substitui o teste autenticado no navegador.
- A EduLegal oficial (`escolalegalbrasil/edulegal`, Supabase `edulegal-mvp`) está fora do escopo de qualquer alteração.
