import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import RawMaterials from './pages/RawMaterials/RawMaterials'
import Products from './pages/Products/Products'
import Clients from './pages/Clients/Clients'
import Orders from './pages/Orders/Orders'
import OrderDetail from './pages/Orders/OrderDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/raw-materials" element={<RawMaterials />} />
      <Route path="/products" element={<Products />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderDetail />} />
    </Routes>
  )
}