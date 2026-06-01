# Setup do Supabase - Central de Links das Squads

## 1. Criar o projeto
1. Acesse https://supabase.com e crie um projeto na sua conta (plano Free).
2. Em Project Settings > API, copie a Project URL e a anon public key.
3. Cole as duas no arquivo `config.js` (campos `SUPABASE_URL` e `SUPABASE_ANON_KEY`).
4. (Depois) Em Organization > Team, convide o e-mail do colega como membro.

## 2. Criar/ajustar a tabela `links`
Em SQL Editor, rode:

```sql
-- cria a tabela se ainda nao existir
create table if not exists public.links (
  id bigint generated always as identity primary key,
  squad text not null,
  categoria text not null,
  nome text not null,
  url text not null,
  criado_em timestamptz not null default now()
);

-- se a tabela ja existia sem a coluna squad, adiciona:
alter table public.links add column if not exists squad text;
```

## 3. Ligar a seguranca por squad (RLS)
```sql
alter table public.links enable row level security;

drop policy if exists "squad isolation" on public.links;

create policy "squad isolation"
on public.links
for all
to authenticated
using ( squad = split_part( (auth.jwt() ->> 'email'), '@', 1 ) )
with check ( squad = split_part( (auth.jwt() ->> 'email'), '@', 1 ) );
```

Isso garante: cada conta so le/escreve os links da sua squad; quem nao esta logado nao ve nada.

## 4. Criar as 8 contas (uma por squad)
Em Authentication > Users > Add user, crie cada conta marcando Auto Confirm User:

| Squad | E-mail (login) | Senha |
|-------|----------------|-------|
| Ariano Suassuna | `ariano@squad.local` | (defina) |
| Luis Gonzaga | `gonzaga@squad.local` | (defina) |
| Clarice Lispector | `clarice@squad.local` | (defina) |
| Manuel Bandeira | `manuel@squad.local` | (defina) |
| Frei Caneca | `frei@squad.local` | (defina) |
| Joao Cabral | `joao@squad.local` | (defina) |
| Chico Science | `chico@squad.local` | (defina) |
| Clementina de Jesus | `clementina@squad.local` | (defina) |

A senha que voce definir aqui e a senha que o colaborador vai digitar na tela de selecao.

## 5. Desligar cadastro publico (opcional, recomendado)
Em Authentication > Sign In / Providers > Email, desative Allow new users to sign up.
Assim so as 8 contas existem.
