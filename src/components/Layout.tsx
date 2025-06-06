import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow container mx-auto px-4 py-6 mt-16 bg-gray-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout