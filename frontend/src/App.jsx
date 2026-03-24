import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  useEffect(() => {
    document.title = "Sesh";
  }, []);
  return (
    <div className="relative min-h-[100dvh] bg-transparent overflow-hidden">
      {/* THE ANIMATION CONTAINER */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-transparent">
        <div className="shape1 op-10"></div>
        <div className="shape2 op-5"></div>
        <div className="shape3 op-10"></div>
      </div>

      <main className="relative z-10">
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
