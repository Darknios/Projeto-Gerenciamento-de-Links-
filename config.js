/* =========================================================
   CONFIG COMPARTILHADA - Central de Links das Squads
   Preencha SUPABASE_URL e SUPABASE_ANON_KEY com os dados do
   seu projeto (Supabase > Project Settings > API).
========================================================= */

const SUPABASE_URL = "https://gfabaucpogatrqqvvuqt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWJhdWNwb2dhdHJxcXZ2dXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTI0NzYsImV4cCI6MjA5NTg4ODQ3Nn0.dxWbk7ggQZdkAQbzYuODyWWibJPcIwKf2XTtU_bVkdk";

// Dominio interno usado nos logins das squads (o colaborador nunca ve isto).
const EMAIL_DOMAIN = "squad.local";

// Catalogo das categorias de links (os cards que aparecem dentro de cada squad).
// Cada squad escolhe quais usar atraves da coluna "categorias" da tabela squads.
// A "squad key" e a parte local do e-mail de login (ex.: ariano -> ariano@squad.local).
// "icone" aponta para um arquivo local em /img (ex.: img/cat-reunioes.png).
// "fallback" e o icone remoto usado ENQUANTO o arquivo local nao existir.
// Para trocar o icone de um card: basta colocar o arquivo com o nome indicado
// em "icone" na pasta /img. Para criar um card novo: adicione uma entrada aqui
// e inclua a chave na coluna "categorias" das squads (Table Editor do Supabase).
const CATEGORIAS = {
  reunioes:      { titulo: "Links de Reunioes",       icone: "img/cat-reunioes.png",      fallback: "https://cdn-icons-png.flaticon.com/512/5968/5968552.png" },
  planilhas:     { titulo: "Planilhas",               icone: "img/cat-planilhas.png",     fallback: "https://cdn-icons-png.flaticon.com/512/732/732220.png" },
  ticket:        { titulo: "Tickets - SICX",          icone: "img/cat-ticket.png",        fallback: "https://cdn-icons-png.flaticon.com/512/5968/5968875.png", busca: true },
  apresentacoes: { titulo: "Apresentacoes",           icone: "img/cat-apresentacoes.png", fallback: "https://cdn-icons-png.flaticon.com/512/3131/3131631.png" },
  prototipo:     { titulo: "Prototipos",              icone: "img/cat-prototipo.png",     fallback: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png" },
  homologacao:   { titulo: "Ambiente de Homologacao", icone: "img/cat-homologacao.png",   fallback: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png" },
  gravacao:      { titulo: "Gravacoes",               icone: "img/cat-gravacao.png",      fallback: "https://cdn-icons-png.flaticon.com/512/4315/4315744.png" },
};

// Helpers usados pelas duas paginas.
function emailDaSquad(squadKey) {
  return `${squadKey}@${EMAIL_DOMAIN}`;
}

function squadDoEmail(email) {
  return (email || "").split("@")[0];
}

// Cliente Supabase unico (o SDK e carregado via <script> antes deste arquivo).
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
