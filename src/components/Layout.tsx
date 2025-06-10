import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 shadow-md mt-16">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm md:text-base font-medium">
              <strong>Frete Grátis até 22 de junho!</strong> Após essa data, o frete será de R$ 15,00
            </p>
          </div>
        </div>
      </div>
      <main className="grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout