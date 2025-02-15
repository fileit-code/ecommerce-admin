import { Route, Routes } from "react-router"
import { ProductProvider } from "./context/ProductContext"
import AuthProvider from "./context/AuthContext"
import AdminDashboard from "./pages/AdminDashboard"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./components/PrivateRoute"
import SignIn from "./pages/SignIn"
import { OrderProvider } from "./context/OrderContext"
import Orders from "./pages/Orders"
import Order from "./pages/Order"

function App() {

  return (
    <>
    <Toaster/>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <AdminDashboard/>
              </PrivateRoute>
            } />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/admin/orders" element={
              <PrivateRoute>
                <Orders/>
              </PrivateRoute>} />
            <Route path="/admin/orders/:id" element={<Order/>} />
          </Routes>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
    </>
  )
}

export default App
