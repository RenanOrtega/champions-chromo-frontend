  import { Route, Routes } from "react-router-dom";
  import Layout from "./components/Layout";
  import HomePage from "./pages/HomePage";
  import SchoolsPage from "./pages/SchoolsPage";
  import AlbumPage from "./pages/AlbumPage";
  import StickersPage from "./pages/StickersPage";
  import { CartProvider } from "./context/CartContext";
  import CartPage from "./pages/CartPage";
  import CheckoutPage from "./pages/CheckoutPage";
  import PixPage from "./pages/PixPage";
  import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

  function App() {
    return (
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="schools/:schoolId/albums" element={<AlbumPage />} />
            <Route path="albums/:albumId/figurinhas" element={<StickersPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/pix" element={<PixPage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    )
  }

  export default App;