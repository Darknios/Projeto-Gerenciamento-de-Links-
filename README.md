# Central de Links das Squads (PE Integrado / GESIG)

Aplicacao web para organizar e compartilhar os links de trabalho de cada squad
(reunioes, planilhas, tickets, apresentacoes, prototipos, homologacao, gravacoes).
Cada squad tem seu proprio espaco protegido por senha, e gerencia os proprios
cards e links sem precisar mexer no codigo.

E um site estatico (HTML + CSS + JavaScript puro, sem build e sem dependencias
locais). Todo o backend (login, banco de dados e armazenamento de imagens) e
fornecido pelo Supabase.

## Como funciona

1. `Pagina_inicial.html` - tela inicial "Escolha a sua Squad". Lista as squads
   (lidas da tabela `squads` do Supabase) e pede a senha da squad escolhida.
2. `index.html` - painel da squad logada. Mostra os cards de categoria e os
   links cadastrados, com busca, copiar link, contador de links e edicao dos
   cards. Sem sessao valida, redireciona de volta para a tela de selecao.
3. O isolamento entre squads e garantido por RLS no Supabase: cada conta so
   le e escreve os dados da propria squad.

## Estrutura

```
Pagina_inicial.html   Tela de selecao de squad (entrada do site)
index.html            Painel de links da squad logada
config.js             Configuracao do Supabase (URL + anon key) e helpers
favicon-gesig.svg     Favicon (logo do GESIG)
img/                  Icones das squads e logos
  ariano.svg          Ariano Suassuna (sol armorial)
  brennand.svg        Francisco Brennand (vaso de ceramica)
  chico.svg           Chico Science (caranguejo / manguebeat)
  gonzaga.svg         Luiz Gonzaga (sanfona)
  lia.svg             Lia de Itamaraca (roda de ciranda)
  hotfix.svg          HOTFIX (chave de boca)
  conhecimento.svg    Gestao de Conhecimento e Capacitacao (birrete + livro)
  gestao.svg          Gestao (engrenagens)
  implantacao.svg     Implantacao (foguete)
  logo-gesig.png      Logo do GESIG
  logo-sad.png        Logo da SAD
SETUP.md              Passo a passo de configuracao do Supabase
README.md             Este arquivo
```

Os icones das squads seguem um mesmo padrao visual: quadrado 512x512 com cantos
arredondados, simbolo branco e degrade da marca GESIG (verde `#7AB829` para azul
`#1D4ED8`). Cada simbolo representa o sentido do nome da squad.

## Configuracao (Supabase)

Os dados de conexao ficam em `config.js` (`SUPABASE_URL` e `SUPABASE_ANON_KEY`).
A anon key e publica por design; a seguranca real vem das politicas de RLS.

O passo a passo completo de criacao das tabelas (`squads`, `categorias`,
`links`), das politicas de seguranca, das contas por squad e do bucket de
imagens esta em [SETUP.md](SETUP.md).

## Rodar localmente

Por ser estatico, basta servir a pasta por HTTP (abrir o arquivo direto via
`file://` quebra o login do Supabase). Qualquer servidor estatico serve:

```bash
# Python
python -m http.server 8080

# ou Node
npx serve .
```

Depois acesse `http://localhost:8080/Pagina_inicial.html`.

## Hospedagem

O site e um conjunto de arquivos estaticos, entao pode ser servido por qualquer
servidor web (Nginx, Apache, etc.) ou por hospedagem estatica. O importante e
apontar a pagina inicial para `Pagina_inicial.html`. Veja a secao de deploy
abaixo para o passo a passo na VM.

## Branches

- `Master` - branch principal.
- `Arthur` - branch de desenvolvimento.
