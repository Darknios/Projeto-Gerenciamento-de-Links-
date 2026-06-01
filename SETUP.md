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

## 7. Gestao de cards pela squad (tabela `categorias` + Storage)

### 7.1 Tabela `categorias`
Cada linha e um card de link de uma squad. Em SQL Editor:

```sql
create table if not exists public.categorias (
  id bigint generated always as identity primary key,
  squad text not null,
  slug text not null,
  titulo text not null,
  icone text,
  busca boolean not null default false,
  ordem int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (squad, slug)
);

alter table public.categorias enable row level security;

drop policy if exists "categorias da squad" on public.categorias;
create policy "categorias da squad"
on public.categorias
for all
to authenticated
using ( squad = split_part( (auth.jwt() ->> 'email'), '@', 1 ) )
with check ( squad = split_part( (auth.jwt() ->> 'email'), '@', 1 ) );
```

### 7.2 Popular os 7 cards padrao para cada squad existente
```sql
insert into public.categorias (squad, slug, titulo, icone, busca, ordem, ativo)
select s.key, d.slug, d.titulo, d.icone, d.busca, d.ordem, true
from public.squads s
cross join (values
  ('reunioes','Links de Reunioes','https://cdn-icons-png.flaticon.com/512/5968/5968552.png', false, 1),
  ('planilhas','Planilhas','https://cdn-icons-png.flaticon.com/512/732/732220.png', false, 2),
  ('ticket','Tickets - SICX','https://cdn-icons-png.flaticon.com/512/5968/5968875.png', true, 3),
  ('apresentacoes','Apresentacoes','https://cdn-icons-png.flaticon.com/512/3131/3131631.png', false, 4),
  ('prototipo','Prototipos','https://cdn-icons-png.flaticon.com/512/1055/1055687.png', false, 5),
  ('homologacao','Ambiente de Homologacao','https://cdn-icons-png.flaticon.com/512/3064/3064197.png', false, 6),
  ('gravacao','Gravacoes','https://cdn-icons-png.flaticon.com/512/4315/4315744.png', false, 7)
) as d(slug, titulo, icone, busca, ordem)
on conflict (squad, slug) do nothing;
```

### 7.3 Bucket de imagens no Storage
1. Menu lateral > Storage > Create a new bucket.
2. Nome: `icones`. Marque Public bucket. Create.
3. Em SQL Editor, aplique as politicas (leitura publica; escrita so na pasta da propria squad):

```sql
drop policy if exists "icones leitura publica" on storage.objects;
create policy "icones leitura publica"
on storage.objects for select
to anon, authenticated
using ( bucket_id = 'icones' );

drop policy if exists "icones escrita da squad" on storage.objects;
create policy "icones escrita da squad"
on storage.objects for all
to authenticated
using (
  bucket_id = 'icones'
  and (storage.foldername(name))[1] = split_part( (auth.jwt() ->> 'email'), '@', 1 )
)
with check (
  bucket_id = 'icones'
  and (storage.foldername(name))[1] = split_part( (auth.jwt() ->> 'email'), '@', 1 )
);
```
