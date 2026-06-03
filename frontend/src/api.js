const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not defined. Set it in your environment or .env file.",
  );
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Request failed");
  }
  return data;
}

export const api = {
  getProducts: () => request("/products"),
  createProduct: (payload) =>
    request("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),
  getCustomers: () => request("/customers"),
  createCustomer: (payload) =>
    request("/customers", { method: "POST", body: JSON.stringify(payload) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: "DELETE" }),
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
};
