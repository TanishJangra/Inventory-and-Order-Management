import { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { api } from "./api";
import Dashboard from "./components/Dashboard";
import ProductManager from "./components/ProductManager";
import CustomerManager from "./components/CustomerManager";
import OrderManager from "./components/OrderManager";

const initialProduct = { name: "", sku: "", price: "", quantity: "" };
const initialCustomer = { full_name: "", email: "", phone: "" };
const initialOrder = {
  customer_id: "",
  items: [{ product_id: "", quantity: "" }],
};

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productData, setProductData] = useState(initialProduct);
  const [editProductId, setEditProductId] = useState(null);
  const [customerData, setCustomerData] = useState(initialCustomer);
  const [orderData, setOrderData] = useState(initialOrder);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const lowStock = useMemo(
    () => products.filter((product) => product.quantity <= 5),
    [products],
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [productList, customerList, orderList] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getOrders(),
      ]);
      setProducts(productList);
      setCustomers(customerList);
      setOrders(orderList);
    } catch (err) {
      setError(err.message);
    }
  }

  function clearMessages() {
    setError("");
    setMessage("");
  }

  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => {
      clearMessages();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, error]);

  const location = useLocation();
  const pageTitle =
    location.pathname === "/" || location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname.slice(1).replace(/^[a-z]/, (c) => c.toUpperCase());

  async function handleCreateProduct(event) {
    event.preventDefault();
    clearMessages();
    try {
      const payload = {
        name: productData.name,
        sku: productData.sku,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
      };

      if (editProductId) {
        await api.updateProduct(editProductId, payload);
        setMessage("Product updated successfully.");
      } else {
        await api.createProduct(payload);
        setMessage("Product created successfully.");
      }

      setProductData(initialProduct);
      setEditProductId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditProduct(product) {
    setEditProductId(product.id);
    setProductData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
    });
    clearMessages();
    setView("products");
  }

  function cancelEdit() {
    setEditProductId(null);
    setProductData(initialProduct);
  }

  async function handleCreateCustomer(event) {
    event.preventDefault();
    clearMessages();
    try {
      await api.createCustomer(customerData);
      setCustomerData(initialCustomer);
      setMessage("Customer created successfully.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateOrder(event) {
    event.preventDefault();
    clearMessages();
    try {
      const payload = {
        customer_id: Number(orderData.customer_id),
        items: orderData.items
          .filter((item) => item.product_id && item.quantity)
          .map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
      };
      await api.createOrder(payload);
      setOrderData(initialOrder);
      setMessage("Order placed successfully.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;
    clearMessages();
    try {
      await api.deleteProduct(id);
      setMessage("Product deleted.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCustomer(id) {
    if (!window.confirm("Delete this customer?")) return;
    clearMessages();
    try {
      await api.deleteCustomer(id);
      setMessage("Customer deleted.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteOrder(id) {
    if (!window.confirm("Cancel this order?")) return;
    clearMessages();
    try {
      await api.deleteOrder(id);
      setMessage("Order cancelled.");
      await loadData();
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleOrderItemChange(index, field, value) {
    const items = [...orderData.items];
    items[index] = { ...items[index], [field]: value };
    setOrderData({ ...orderData, items });
  }

  function addOrderItem() {
    setOrderData({
      ...orderData,
      items: [...orderData.items, { product_id: "", quantity: "" }],
    });
  }

  function removeOrderItem(index) {
    const items = orderData.items.filter((_, idx) => idx !== index);
    setOrderData({ ...orderData, items });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Inventory Manager</h1>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Products
          </NavLink>
          <NavLink
            to="/customers"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Customers
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Orders
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <header>
          <h2>{pageTitle}</h2>
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                products={products}
                customers={customers}
                orders={orders}
                lowStock={lowStock}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                products={products}
                customers={customers}
                orders={orders}
                lowStock={lowStock}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductManager
                productData={productData}
                setProductData={setProductData}
                editProductId={editProductId}
                onSubmit={handleCreateProduct}
                onCancelEdit={cancelEdit}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                products={products}
              />
            }
          />
          <Route
            path="/customers"
            element={
              <CustomerManager
                customerData={customerData}
                setCustomerData={setCustomerData}
                onSubmit={handleCreateCustomer}
                onDelete={handleDeleteCustomer}
                customers={customers}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrderManager
                orderData={orderData}
                products={products}
                customers={customers}
                orders={orders}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                onSubmit={handleCreateOrder}
                onCustomerChange={(value) =>
                  setOrderData({ ...orderData, customer_id: value })
                }
                onOrderItemChange={handleOrderItemChange}
                onAddOrderItem={addOrderItem}
                onRemoveOrderItem={removeOrderItem}
                onDeleteOrder={handleDeleteOrder}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
