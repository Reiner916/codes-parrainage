import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { readStats } from "@/lib/stats";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  const [db, stats] = await Promise.all([readDb(), readStats()]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1015]">
      <AdminDashboard
        initialOffers={db.offers}
        initialCategories={db.categories}
        initialStats={stats}
      />
    </div>
  );
}
