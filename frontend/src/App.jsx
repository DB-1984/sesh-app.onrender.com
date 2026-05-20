import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ui/scroll-to-top";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  useEffect(() => {
    document.title = "Sesh";
  }, []);
  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-r from-slate-900 to-slate-700 overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Blob 1: Deep Charcoal - Top Right */}
        <div
          className="absolute -top-[10%] -right-[10%] w-[45rem] h-[45rem] 
             -full bg-zinc-800/20 blur-[120px] 
            animate-float dark:bg-zinc-900/40"
        />

        {/* Blob 2: Stealth Black/Gray - Bottom Left */}
        <div
          className="absolute -bottom-[15%] -left-[10%] w-[50rem] h-[50rem] 
             -full bg-zinc-400/10 blur-[140px] 
            animate-float-slow dark:bg-black/60"
        />

        {/* Optional: Subtle Center Grain/Shadow to tie it together */}
        <div className="absolute inset-0 bg-white/90/5 dark:bg-black/20" />
      </div>
      <main className="relative z-10">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* Toasts always need to be globally mounted */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
