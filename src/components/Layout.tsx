import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SchoolBanner from "./SchoolBanner";
import { useSchoolBanner } from "@/context/BannerContext";

const Layout = () => {
  const { pathname } = useLocation();
  const { warning, bgWarningColor } = useSchoolBanner();
  // O aviso é da escola escolhida, então não aparece antes de o cliente escolher uma.
  const showBanner = pathname !== '/' && pathname !== '/schools';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-20">
        <Navbar />
        {showBanner && <SchoolBanner warning={warning} bgWarningColor={bgWarningColor} />}
      </div>
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
