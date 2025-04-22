import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SchoolsPage from "./pages/SchoolsPage";
import AlbumPage from "./pages/AlbumPage";
import StickersPage from "./pages/StickersPage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="schools" element={<SchoolsPage />} />
          <Route path="schools/:schoolId/albuns" element={<AlbumPage />} />
          <Route path="albuns/:albumId/figurinhas" element={<StickersPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App;