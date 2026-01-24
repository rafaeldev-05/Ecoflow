import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Faltou SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const users = [
  { email: "operacional@ecoflow.demo", password: "demo123456", full_name: "Maria Silva" },
  { email: "gestor@ecoflow.demo", password: "demo123456", full_name: "João Santos" },
  { email: "admin@ecoflow.demo", password: "demo123456", full_name: "Ana Costa" },
];

for (const u of users) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { full_name: u.full_name },
  });

  if (error) {
    console.error("Erro criando:", u.email, error.message);
  } else {
    console.log("Criado:", u.email, data.user?.id);
  }
}
