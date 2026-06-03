import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

export default function ProductManager({
  productData,
  setProductData,
  editProductId,
  onSubmit,
  onCancelEdit,
  onEdit,
  onDelete,
  products,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const visibleProducts = useMemo(
    () => products.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize, products],
  );

  const showingStart = products.length ? (page - 1) * pageSize + 1 : 0;
  const showingEnd = Math.min(page * pageSize, products.length);

  return (
    <section className="panel">
      <form className="form-grid" onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>SKU</label>
          <input
            value={productData.sku}
            onChange={(e) =>
              setProductData({ ...productData, sku: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            min="0"
            value={productData.quantity}
            onChange={(e) =>
              setProductData({ ...productData, quantity: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">
          {editProductId ? "Update Product" : "Add Product"}
        </button>
        {editProductId && (
          <button type="button" className="tertiary" onClick={onCancelEdit}>
            Cancel edit
          </button>
        )}
      </form>

      <div className="table-meta">
        Showing {showingStart}–{showingEnd} of {products.length}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => onEdit(product)}>Edit</button>
                  <button
                    className="destructive"
                    onClick={() => onDelete(product.id)}
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
        totalItems={products.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </section>
  );
}
