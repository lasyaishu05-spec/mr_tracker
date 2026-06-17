import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, MoreVertical } from 'lucide-react';

export const DataTable = ({
  data,
  columns,
  onRowClick = null,
  loading = false,
  actions = null,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const itemsPerPage = 10;

  const filteredData = data.filter(item =>
    columns.some(col => {
      const value = item[col.key];
      return value?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="glass-panel overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-text" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border text-text-h rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-hover border-b border-border">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-text uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-left text-xs font-semibold text-text">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-text">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-text">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-surface-hover cursor-pointer transition-colors"
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 text-sm text-text-h">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu item={item} actions={actions} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-text">
          Showing {paginatedData.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-sm font-medium text-text-h disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium text-text-h">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-sm font-medium text-text-h disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionMenu = ({ item, actions }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 hover:bg-surface-hover text-text rounded transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-surface border border-border rounded-lg shadow-xl z-10 min-w-[150px] overflow-hidden">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                action.onClick(item);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${
                idx < actions.length - 1 ? 'border-b border-border' : ''
              } ${action.color || 'text-text-h'}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
