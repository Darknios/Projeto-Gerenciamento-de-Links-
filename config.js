/* =========================================================
   CONFIG COMPARTILHADA - Central de Links das Squads
   Preencha SUPABASE_URL e SUPABASE_ANON_KEY com os dados do
   seu projeto (Supabase > Project Settings > API).
========================================================= */

const SUPABASE_URL = "https://gfabaucpogatrqqvvuqt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWJhdWNwb2dhdHJxcXZ2dXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTI0NzYsImV4cCI6MjA5NTg4ODQ3Nn0.dxWbk7ggQZdkAQbzYuODyWWibJPcIwKf2XTtU_bVkdk";

// Dominio interno usado nos logins das squads (o colaborador nunca ve isto).
const EMAIL_DOMAIN = "squad.local";

// As categorias (cards) de cada squad agora vivem na tabela "categorias" do
// Supabase, gerenciadas pela propria squad dentro do sistema. Ver index.html.

// Helpers usados pelas duas paginas.
function emailDaSquad(squadKey) {
  return `${squadKey}@${EMAIL_DOMAIN}`;
}

function squadDoEmail(email) {
  return (email || "").split("@")[0];
}

// Cliente Supabase unico (o SDK e carregado via <script> antes deste arquivo).
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
