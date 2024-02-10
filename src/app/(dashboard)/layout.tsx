import Navbar from "./_components/navbar";
import SideBar from "./_components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: AuthLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="h-screen hidden md:flex min-w-56 shadow-sm transition-transform"
        minSize={15}
        defaultSize={15}
        maxSize={15}
      >
        <SideBar />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={85}>
        <div className="flex flex-col space-y-2 ">
          <Navbar />
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
