import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
