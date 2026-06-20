import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Bienvenida, {user.email}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Atenciones hoy</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Recordatorios pendientes</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">Pagos por cobrar</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">—</p>
          </div>
        </div>
      </div>
    </main>
  );
}
