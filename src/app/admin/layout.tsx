import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 lg:grid-cols-[200px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  );
}
