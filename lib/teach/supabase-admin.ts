import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con service_role: BYPASSA RLS. Solo servidor.
// `import "server-only"` de arriba rompe el build si alguien lo importa
// desde un componente cliente, en vez de filtrar la key al navegador.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
