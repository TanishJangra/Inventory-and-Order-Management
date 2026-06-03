export default function Dashboard({ products, customers, orders, lowStock }) {
  return (
    <section className="dashboard-grid">
      <div className="card">
        <h3>Total Products</h3>
        <strong>{products.length}</strong>
      </div>
      <div className="card">
        <h3>Total Customers</h3>
        <strong>{customers.length}</strong>
      </div>
      <div className="card">
        <h3>Total Orders</h3>
        <strong>{orders.length}</strong>
      </div>
      <div className="card">
        <h3>Low Stock Products</h3>
        <ul>
          {lowStock.length ? (
            lowStock.map((product) => (
              <li key={product.id}>
                {product.name} ({product.quantity})
              </li>
            ))
          ) : (
            <li>All stock levels are healthy.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
