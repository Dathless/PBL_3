import { Navigate, Route, Routes } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import Dashboard from "./Dashboard"
import Users from "./Users"
import Products from "./Products"
import Orders from "./Orders"
import Categories from "./Categories"
import Promotions from "./Promotions"
import Reviews from "./Reviews"
import Content from "./Content"
import Operations from "./Operations"
import Reports from "./Reports"
import Complaints from "./Complaints"
import Payouts from "./Payouts"
import Settings from "./Settings"
import Security from "./Security"

export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="categories" element={<Categories />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="content" element={<Content />} />
        <Route path="operations" element={<Operations />} />
        <Route path="reports" element={<Reports />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="settings" element={<Settings />} />
        <Route path="security" element={<Security />} />
      </Route>
    </Routes>
  )
}

