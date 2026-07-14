import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"
import Login from "./pages/LoginForm.jsx"
import SignupForm from "./pages/SignupForm.jsx"
import ContextProvider from "./contexts/ContextProvider.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import ProductListingPage from "./pages/ProductListingPage.jsx"
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx"
import WishlistPage from "./pages/WishlistPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import UserAddresses from "./pages/UserAddresses.jsx"
import AddAddressForm from "./pages/AddAddressForm.jsx"
import YourOrders from "./pages/YourOrders.jsx"
import PaymentMethods from "./pages/PaymentMethod.jsx"
import OrderDetails from "./pages/OrderDetails.jsx"
import NewArrival from "./pages/NewArrival.jsx"
import DiwaliSale from "./pages/DiwaliSale.jsx"
import SaleProducts from "./pages/SaleProducts.jsx"
import EditYourOrder from "./pages/EditYourOrder.jsx"
import { ToastContainer } from "react-toastify"
import ContactUs from "./pages/ContactUs.jsx"
import Error from "./components/Error.jsx"
import { useEffect, useState } from "react"
import GetUser from "./services/GetClothsData.js"

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate()

  const { user } = GetUser()

  const token = localStorage.getItem("bv_token")

  useEffect(() => {
    if (user === null || !token) {
      navigate("/login")
    }
  }, [user, token])

  if (!user) {
    return
  }

  return <div>{children}</div>
}

const NormalLayout = ({ children }) => {
  return <div>{children}</div>
}

export default function App() {
  return (
    <Router>
      <ContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/"
            element={
              <NormalLayout>
                <LandingPage />
              </NormalLayout>
            }
          />
          <Route
            path="/products/:mainCategory"
            element={
              <ProtectedLayout>
                <ProductListingPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/productDetails/:id"
            element={
              <ProtectedLayout>
                <ProductDetailsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedLayout>
                <WishlistPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedLayout>
                <CartPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedLayout>
                <UserProfile />
              </ProtectedLayout>
            }
          />
          <Route
            path="/userAddress/editOrder/:orderId"
            element={
              <ProtectedLayout>
                <UserAddresses />
              </ProtectedLayout>
            }
          />
          <Route
            path="/userAddress/:route"
            element={
              <ProtectedLayout>
                <UserAddresses />
              </ProtectedLayout>
            }
          />
          <Route
            path="userAddress"
            element={
              <ProtectedLayout>
                <UserAddresses />
              </ProtectedLayout>
            }
          />
          <Route
            path="/addAddress"
            element={
              <ProtectedLayout>
                <AddAddressForm />
              </ProtectedLayout>
            }
          />
          <Route
            path="/editAddress/:id"
            element={
              <ProtectedLayout>
                <AddAddressForm />
              </ProtectedLayout>
            }
          />
          <Route
            path="/yourOrders"
            element={
              <ProtectedLayout>
                <YourOrders />
              </ProtectedLayout>
            }
          />
          <Route
            path="/paymentMethods"
            element={
              <ProtectedLayout>
                <PaymentMethods />
              </ProtectedLayout>
            }
          />
          <Route
            path="/orderDetails/:id"
            element={
              <ProtectedLayout>
                <OrderDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/newArrival"
            element={
              <ProtectedLayout>
                <NewArrival />
              </ProtectedLayout>
            }
          />
          <Route
            path="/diwaliSale"
            element={
              <ProtectedLayout>
                <DiwaliSale />
              </ProtectedLayout>
            }
          />
          <Route
            path="/saleProducts/:commonCategory"
            element={
              <ProtectedLayout>
                <SaleProducts />
              </ProtectedLayout>
            }
          />
          <Route
            path="/editOrder/:orderId"
            element={
              <ProtectedLayout>
                <EditYourOrder />
              </ProtectedLayout>
            }
          />
          <Route
            path="/contactUs"
            element={
              <ProtectedLayout>
                <ContactUs />
              </ProtectedLayout>
            }
          />
          <Route
            path="/error"
            element={
              <ProtectedLayout>
                <Error />
              </ProtectedLayout>
            }
          />

          <Route path="*" element={<Login />} />
        </Routes>
      </ContextProvider>
      <ToastContainer />
    </Router>
  )
}
