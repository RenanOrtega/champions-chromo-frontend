import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SchoolsPage from "./pages/SchoolsPage";
import AlbumPage from "./pages/AlbumPage";
import StickersPage from "./pages/StickersPage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderPage from "./pages/OrderPage";
import { BannerProvider } from "./context/BannerContext";

function App() {
  return (
    <CartProvider>
      <BannerProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="schools/:schoolId/albums" element={<AlbumPage />} />
            <Route path="albums/:albumId/figurinhas" element={<StickersPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="order" element={<OrderPage />} />
            {/* <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/pix" element={<PixPage />} /> */}
            {/* <Route path="checkout" element={<StripeCheckoutPage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BannerProvider>
    </CartProvider>
  )
}

export default App;