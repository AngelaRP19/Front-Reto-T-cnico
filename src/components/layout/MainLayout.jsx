import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg transition-colors duration-[400ms]">
      <Navbar />
      <main className="flex-1 bg-bg transition-colors duration-[400ms] min-[2560px]:py-4 min-[3840px]:py-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
