import Sidebar from "./Sidebar";
import Topbar from "./TopBar";

export default function PageWrapper({ children }) {
  return (
    
    <div className="flex h-screen overflow-hidden">
      {/*Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/*Topbar */}
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}