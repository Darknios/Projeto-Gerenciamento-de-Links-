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

## 4. Criar as contas (uma por squad)
Em Authentication > Users > Add user, crie cada conta marcando Auto Confirm User:

| Squad | E-mail (login) | Senha |
|-------|----------------|-------|
| Ariano Suassuna | `ariano@squad.local` | (defina) |
| Francisco Brennand | `brennand@squad.local` | (defina) |
| Chico Science | `chico@squad.local` | (defina) |
| Luiz Gonzaga | `gonzaga@squad.local` | (defina) |
| HOTFIX | `hotfix@squad.local` | (defina) |
| Lia de Itamaraca | `lia@squad.local` | (defina) |

A senha que voce definir aqui e a senha que o colaborador vai digitar na tela de selecao.
Para adicionar uma nova squad no futuro: crie a conta aqui e adicione a linha
correspondente na tabela `squads` (secao 6).

## 5. Desligar cadastro publico (opcional, recomendado)
Em Authentication > Sign In / Providers > Email, desative Allow new users to sign up.
Assim so as contas que voce criar existem.

## 6. Tabela `squads` (nomes, icones e cards de cada squad)
Esta tabela controla quais squads aparecem na tela de selecao, o nome, o icone
(arquivo em `/img`) e quais cards de categoria cada squad mostra. Voce gerencia
tudo pelo dashboard do Supabase (Table Editor), sem mexer no codigo.

Em SQL Editor, rode:

```sql
create table if not exists public.squads (
  key text primary key,
  nome text not null,
  descricao text,
  icone text,
  ordem int not null default 0,
  ativo boolean not null default true,
  categorias text[] not null default '{}'
);

alter table public.squads enable row level security;

-- Leitura publica: a tela de selecao lista as squads ANTES do login.
drop policy if exists "squads leitura publica" on public.squads;
create policy "squads leitura publica"
on public.squads for select
to anon, authenticated
using ( true );
```

Popular as 6 squads (todas as categorias habilitadas por padrao; depois e so
desmarcar no Table Editor o que cada squad nao usa, ex.: tirar `ticket` de quem
nao usa o SICX):

```sql
insert into public.squads (key, nome, descricao, icone, ordem, ativo, categorias) values
('ariano','Ariano Suassuna','', 'img/ariano.svg', 1, true, array['reunioes','planilhas','ticket','apresentacoes','prototipo','homologacao','gravacao']),
('brennand','Francisco Brennand','', 'img/brennand.svg', 2, true, array['reunioes','planilhas','ticket','apresentacoes','prototipo','homologacao','gravacao']),
('chico','Chico Science','', 'img/chico.svg', 3, true, array['reunioes','planilhas','ticket','apresentacoes','prototipo','homologacao','gravacao']),
('gonzaga','Luiz Gonzaga','', 'img/gonzaga.svg', 4, true, array['reunioes','planilhas','ticket','apresentacoes','prototipo','homologacao','gravacao']),
('hotfix','HOTFIX','', 'img/hotfix.svg', 5, true, array['reunioes','planilhas','ticket','apresentacoes','prototipo','homologacao','gravacao']),
('lia','Lia de Itamaraca','', 'img/lia.svg', 6, true, array['reunioes','planilhas','ticket','apresentacoes','prototipo','homologacao','gravacao'])
on conflict (key) do update set
  nome = excluded.nome, icone = excluded.icone, ordem = excluded.ordem,
  ativo = excluded.ativo, categorias = excluded.categorias;
```

Categorias validas (chaves usadas na coluna `categorias`):
`reunioes`, `planilhas`, `ticket`, `apresentacoes`, `prototipo`, `homologacao`, `gravacao`.
