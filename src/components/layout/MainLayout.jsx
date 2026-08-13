import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg transition-colors duration-[400ms]">
      <Navbar />
      <main className="flex-1 bg-bg transition-colors duration-[400ms]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
