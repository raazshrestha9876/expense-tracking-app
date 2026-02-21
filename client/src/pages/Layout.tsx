import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Siderbar";
import { SidebarProvider } from "@/context/sidebarContext";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex flex-1 flex-col w-full">
          <Navbar />

          <ToastContainer position="bottom-right" />

          <main className="overflow-y-auto h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
