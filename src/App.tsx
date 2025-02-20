import { Route, Routes } from "react-router"
import { ProductProvider } from "./context/ProductContext"
import AuthProvider from "./context/AuthContext"
import AdminDashboard from "./pages/AdminDashboard"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./components/PrivateRoute"
import { OrderProvider } from "./context/OrderContext"
import Orders from "./pages/Orders"
import Order from "./pages/Order"
import SettingsPage from "./pages/SettingsPage"
import SetupPage from "./pages/SetupPage"
import LandingPage from "./pages/LadingPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <>
    <Toaster/>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/home" element={
              <PrivateRoute>
                <AdminDashboard/>
              </PrivateRoute>
            } />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/signin" element={<LoginPage/>} />
            <Route path="/setup" element={<SetupPage/>} />
            <Route path="/admin/orders" element={
              <PrivateRoute>
                <Orders/>
              </PrivateRoute>} />
            <Route path="/admin/orders/:id" element={
              <PrivateRoute>
                <Order/>
              </PrivateRoute>} />
            <Route path="/admin/settings" element={
              <PrivateRoute>
                <SettingsPage/>
              </PrivateRoute>} />
          </Routes>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
    </>
  )
}

export default App
