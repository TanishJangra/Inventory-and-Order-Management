export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const pageCount = Math.ceil(totalItems / pageSize);
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={currentPage === page ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
