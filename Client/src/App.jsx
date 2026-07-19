import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Alogin from "./Admin/Alogin";
import Asignup from "./Admin/Asignup";
import Ahome from "./Admin/Ahome";
import AdminItems from "./Admin/items";
import AdminSeller from "./Admin/Seller";
import AdminUsers from "./Admin/Users";
import Slogin from "./Seller/Slogin";
import Ssignup from "./Seller/Ssignup";
import Shome from "./Seller/Shome";
import Addbook from "./Seller/Addbook";
import MyProducts from "./Seller/MyProducts";
import SellerOrders from "./Seller/Orders";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Uhome from "./User/Uhome";
import Products from "./User/Products";
import Uitem from "./User/Uitem";
import MyOrders from "./User/MyOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/admin/login" element={<Alogin />} />
        <Route path="/admin/signup" element={<Asignup />} />
        <Route path="/admin" element={<Ahome />} />
        <Route path="/admin/books" element={<AdminItems />} />
        <Route path="/admin/sellers" element={<AdminSeller />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="/seller/login" element={<Slogin />} />
        <Route path="/seller/signup" element={<Ssignup />} />
        <Route path="/seller" element={<Shome />} />
        <Route path="/seller/add-book" element={<Addbook />} />
        <Route path="/seller/my-products" element={<MyProducts />} />
        <Route path="/seller/orders" element={<SellerOrders />} />

        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user" element={<Uhome />} />
        <Route path="/user/books" element={<Products />} />
        <Route path="/user/books/:id" element={<Uitem />} />
        <Route path="/user/orders" element={<MyOrders />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
