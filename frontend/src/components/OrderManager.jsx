import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

export default function OrderManager({
  orderData,
  products,
  customers,
  orders,
  selectedOrder,
  setSelectedOrder,
  onSubmit,
  onCustomerChange,
  onOrderItemChange,
  onAddOrderItem,
  onRemoveOrderItem,
  onDeleteOrder,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const visibleOrders = useMemo(
    () => orders.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize, orders],
  );

  const showingStart = orders.length ? (page - 1) * pageSize + 1 : 0;
  const showingEnd = Math.min(page * pageSize, orders.length);

  return (
    <section className="panel">
      <form className="order-form" onSubmit={onSubmit}>
        <div>
          <label>Customer</label>
          <select
            value={orderData.customer_id}
            onChange={(e) => onCustomerChange(e.target.value)}
            required
          >
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="order-items">
          <div className="order-items-header">
            <strong>Order Items</strong>
            <button type="button" onClick={onAddOrderItem}>
              Add item
            </button>
          </div>
          {orderData.items.map((item, index) => (
            <div className="order-item-row" key={index}>
              <select
                value={item.product_id}
                onChange={(e) =>
                  onOrderItemChange(index, "product_id", e.target.value)
                }
                required
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.quantity} in stock)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  onOrderItemChange(index, "quantity", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="destructive"
                onClick={() => onRemoveOrderItem(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="submit">Place Order</button>
      </form>

      <div className="table-meta">
        Showing {showingStart}–{showingEnd} of {orders.length}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {customers.find((c) => c.id === order.customer_id)
                    ?.full_name || order.customer_id}
                </td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => setSelectedOrder(order)}>View</button>
                  <button
                    className="destructive"
                    onClick={() => onDeleteOrder(order.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalItems={orders.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {selectedOrder && (
        <div className="detail-card">
          <h3>Order #{selectedOrder.id}</h3>
          <p>
            <strong>Customer:</strong>{" "}
            {customers.find((c) => c.id === selectedOrder.customer_id)
              ?.full_name || selectedOrder.customer_id}
          </p>
          <p>
            <strong>Total:</strong> ${selectedOrder.total_amount.toFixed(2)}
          </p>
          <div>
            <strong>Items</strong>
            <ul>
              {selectedOrder.items.map((item, idx) => {
                const product = products.find(
                  (product) => product.id === item.product_id,
                );
                return (
                  <li key={idx}>
                    {product?.name || `Product ${item.product_id}`} -{" "}
                    {item.quantity} × ${item.unit_price.toFixed(2)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
