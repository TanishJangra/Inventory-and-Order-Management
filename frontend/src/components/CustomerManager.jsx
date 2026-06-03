import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

export default function CustomerManager({
  customerData,
  setCustomerData,
  onSubmit,
  onDelete,
  customers,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(customers.length / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const visibleCustomers = useMemo(
    () => customers.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize, customers],
  );

  const showingStart = customers.length ? (page - 1) * pageSize + 1 : 0;
  const showingEnd = Math.min(page * pageSize, customers.length);

  return (
    <section className="panel">
      <form className="form-grid" onSubmit={onSubmit}>
        <div>
          <label>Full Name</label>
          <input
            value={customerData.full_name}
            onChange={(e) =>
              setCustomerData({ ...customerData, full_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={customerData.email}
            onChange={(e) =>
              setCustomerData({ ...customerData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            value={customerData.phone}
            onChange={(e) =>
              setCustomerData({ ...customerData, phone: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">Add Customer</button>
      </form>

      <div className="table-meta">
        Showing {showingStart}–{showingEnd} of {customers.length}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <button
                    className="destructive"
                    onClick={() => onDelete(customer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalItems={customers.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </section>
  );
}
