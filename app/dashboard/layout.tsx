// app/pricing/layout.tsx
import SidebarDoc from "@/components/sidebardoc";

export default function DoctorsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row h-full justify-between gap-4 py-8 md:py-10">
      {/* <SidebarDoc /> */}
      <div className="inline-block h-full m-3 text-center justify-center flex-1">
        {children}
      </div>
    </section>
  );
}
