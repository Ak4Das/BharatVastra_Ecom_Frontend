import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ClothsContextProvider from "./contexts/ClothsContextProvider.jsx"

import App from "./App.jsx"
import ProductListingPage from "./pages/ProductListingPage.jsx"
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx"
import WishlistPage from "./pages/WishlistPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import UserAddresses from "./pages/UserAddresses.jsx"
import AddAddressForm from "./pages/AddAddressForm.jsx"
import YourOrders from "./pages/YourOrders.jsx"
import PaymentMethods from "./pages/PaymentMethod.jsx"
import LoginForm from "./pages/LoginForm.jsx"
import OrderDetails from "./pages/OrderDetails.jsx"
import NewArrival from "./pages/NewArrival.jsx"
import DiwaliSale from "./pages/DiwaliSale.jsx"
import SaleProducts from "./pages/SaleProducts.jsx"
import EditYourOrder from "./pages/EditYourOrder.jsx"
import { ToastContainer } from 'react-toastify';
import ContactUs from "./pages/ContactUs.jsx"
import Error from "./components/Error.jsx"

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/products/:mainCategory", element: <ProductListingPage /> },
  { path: "/productDetails/:id", element: <ProductDetailsPage /> },
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/user", element: <UserProfile /> },
  { path: "/userAddress/editOrder/:orderId", element: <UserAddresses /> },
  { path: "/userAddress/:route", element: <UserAddresses /> },
  { path: "/userAddress", element: <UserAddresses /> },
  { path: "/addAddress", element: <AddAddressForm /> },
  { path: "/editAddress/:id", element: <AddAddressForm /> },
  { path: "/yourOrders", element: <YourOrders /> },
  { path: "/paymentMethods", element: <PaymentMethods /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/orderDetails/:id", element: <OrderDetails /> },
  { path: "/newArrival", element: <NewArrival /> },
  { path: "/diwaliSale", element: <DiwaliSale /> },
  { path: "/saleProducts/:commonCategory", element: <SaleProducts /> },
  { path: "/editOrder/:orderId", element: <EditYourOrder /> },
  { path: "/contactUs", element: <ContactUs /> },
  { path: "/error", element: <Error /> },
])

createRoot(document.getElementById("root")).render(
  <ClothsContextProvider>
    {/* <StrictMode> */}
      <RouterProvider router={router} />
      <ToastContainer />
    {/* </StrictMode> */}
  </ClothsContextProvider>
)
