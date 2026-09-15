import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { AutomationRunner } from "@/components/app/automation-runner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AutomationRunner />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="scroll-thin flex-1 overflow-y-auto px-8 py-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
