import { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Store } from './Store';
import Sidebar from './components/SideBar/Sidebar';
import Body from './components/Body/Body';
import ProductDetails from './components/Body/ProductDetails/ProductDetails';
import Cart from './components/Body/Cart/Cart';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ShippingAddress from './components/Body/ShippingAddress/ShippingAddress';
import PlaceOrder from './components/Body/PlaceOrder/PlaceOrder';
import Order from './components/Body/Order/Order';
import OrderHistory from './components/Body/OrderHistory/OrderHistory';
import Profile from './components/Body/Profile/Profile';
import Search from './components/Body/Search/Search';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardScreen from './components/Body/DashboardScreen/DashboardScreen';
import ProductList from './components/Body/ProductList/ProductList';
import ProductEditing from './components/Body/ProductEditing/ProductEditing';
import OrderList from './components/Body/OrderList/OrderList';
import UserList from './components/Body/User List/UserList';
import UserEditing from './components/Body/UserEditing/UserEditing';

const Dashboard = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return (
    <BrowserRouter>
      <Helmet>
        <title>Samarithanna</title>
      </Helmet>
      <div className="dashboard flex">
        <ToastContainer position="bottom-center" limit={1} />
        <div className="dashboardContainer flex">
          {userInfo ? (
            <>
              <Sidebar />
              <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shipping" element={<ShippingAddress />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <Order />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/orderhistory"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/search" element={<Search />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <DashboardScreen />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ProductList />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/product/:id"
                  element={
                    <AdminRoute>
                      <ProductEditing />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <OrderList />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <UserList />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/admin/user/:id"
                  element={
                    <AdminRoute>
                      <UserEditing />
                    </AdminRoute>
                  }
                ></Route>
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Register />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Dashboard;
