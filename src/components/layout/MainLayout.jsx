import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default MainLayout;
