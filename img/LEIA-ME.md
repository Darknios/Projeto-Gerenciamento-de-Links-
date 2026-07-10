# Pasta de imagens (/img)

Coloque aqui as imagens com os nomes exatos abaixo e elas aparecem sozinhas no site.
Enquanto um arquivo nao existir, o site mostra um placeholder remoto (nada quebra).

## Logos do cabecalho (valem para as duas paginas de uma vez)
- `logo-sad.png` ..... logo da SAD (fica a esquerda)
- `logo-gesig.png` ... logo da GESIG (fica a direita)

Dica: PNG com fundo transparente fica melhor. Altura ideal por volta de 72px.

## Icones dos cards de link (categorias)
- `cat-reunioes.png`
- `cat-planilhas.png`
- `cat-ticket.png`
- `cat-apresentacoes.png`
- `cat-prototipo.png`
- `cat-homologacao.png`
- `cat-gravacao.png`

Para um card de categoria NOVO: adicione a entrada em `config.js` (objeto CATEGORIAS)
com o nome do arquivo, e inclua a chave na coluna `categorias` das squads.

## Icones das squads
O caminho do icone de cada squad fica na coluna `icone` da tabela `squads`
(Supabase > Table Editor). Exemplo: para a squad `ariano`, coloque o arquivo
`img/ariano.png` e ponha `img/ariano.png` na coluna `icone` daquela linha.

Hoje os arquivos sao SVG (ariano.svg, gonzaga.svg, etc.). Se trocar por PNG,
lembre de atualizar o nome na coluna `icone`.

## Observacao
Formatos aceitos: png, jpg, svg, webp. Use o mesmo nome indicado acima
(tudo minusculo, sem espacos e sem acentos).
