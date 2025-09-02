import React from 'react';

export interface Column<T> {
  title: string;
  // Accessor can be a key of the data object or a function that returns a React node
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string; // Optional class for th/td styling
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  getRowKey: (item: T) => string | number;
}

const Table = <T extends object>({ columns, data, loading, error, getRowKey }: TableProps<T>) => {
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    // Type assertion to treat accessor as a key of T
    return item[column.accessor as keyof T] as React.ReactNode;
  };

  const renderTableBody = () => {
    if (loading) {
      return <tr><td colSpan={columns.length} className="text-center py-4 text-gray-500">Cargando...</td></tr>;
    }
    if (error) {
      return <tr><td colSpan={columns.length} className="text-center py-4 text-red-500">{error}</td></tr>;
    }
    if (data.length === 0) {
      return <tr><td colSpan={columns.length} className="text-center py-4 text-gray-500">No se encontraron datos.</td></tr>;
    }
    return data.map((item) => (
      <tr key={getRowKey(item)}>
        {columns.map((col, index) => (
          <td key={index} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${col.className || ''}`}>
            {renderCell(item, col)}
          </td>
        ))}
      </tr>
    ));
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {renderTableBody()}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
