/* =========================================================
   CONFIG COMPARTILHADA - Central de Links das Squads
   Preencha SUPABASE_URL e SUPABASE_ANON_KEY com os dados do
   seu projeto (Supabase > Project Settings > API).
========================================================= */

const SUPABASE_URL = "COLE_AQUI_A_PROJECT_URL";
const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY";

// Dominio interno usado nos logins das squads (o colaborador nunca ve isto).
const EMAIL_DOMAIN = "squad.local";

// Mapa das squads. A CHAVE e a "squad key" = parte local do e-mail de login
// (ex.: ariano -> ariano@squad.local). Deve bater com as contas criadas no Supabase.
const SQUADS = {
  ariano:     { nome: "Ariano Suassuna" },
  gonzaga:    { nome: "Luis Gonzaga" },
  clarice:    { nome: "Clarice Lispector" },
  manuel:     { nome: "Manuel Bandeira" },
  frei:       { nome: "Frei Caneca" },
  joao:       { nome: "Joao Cabral" },
  chico:      { nome: "Chico Science" },
  clementina: { nome: "Clementina de Jesus" },
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
