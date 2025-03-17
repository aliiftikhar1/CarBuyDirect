"use client";

import { Toaster } from "sonner";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import NavBar from "./components/Navbar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";

export default function Layout({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <main className="flex flex-col flex-1 overflow-hidden">
              <NavBar />
              <div className="flex-1 overflow-auto p-4">{children}</div>
              <Toaster richColors position="top-right" />
            </main>
          </div>
        </SidebarProvider>
      </PersistGate>
    </Provider>
  );
}
