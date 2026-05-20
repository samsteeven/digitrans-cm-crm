export default function DataTable({ columns, data, loading, onRowClick, pagination, onPageChange }) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  const currentPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;
  const total = pagination?.total || data.length;
  const from = pagination?.from || 1;
  const to = pagination?.to || data.length;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(lastPage, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  Aucune donnee
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {lastPage > 1 && onPageChange && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            {from} - {to} sur {total} resultats
          </p>
          <div className="flex items-center gap-1">
            {/* Precedent */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &laquo;
            </button>

            {/* Premiere page si loin */}
            {currentPage > 3 && (
              <>
                <button onClick={() => onPageChange(1)} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">1</button>
                {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
              </>
            )}

            {/* Pages autour de la courante */}
            {getPages().map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={"px-3 py-1 text-sm border rounded-lg " + (p === currentPage ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:bg-gray-50')}
              >
                {p}
              </button>
            ))}

            {/* Derniere page si loin */}
            {currentPage < lastPage - 2 && (
              <>
                {currentPage < lastPage - 3 && <span className="px-2 text-gray-400">...</span>}
                <button onClick={() => onPageChange(lastPage)} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">{lastPage}</button>
              </>
            )}

            {/* Suivant */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
