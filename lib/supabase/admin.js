import { createClient } from "@supabase/supabase-js";

// service_role — обходит все RLS-правила. Использовать ТОЛЬКО в серверном
// коде, и только после проверки, что текущий пользователь — админ (см.
// app/(main)/admin/layout.js). Никогда не импортировать в клиентский код.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
