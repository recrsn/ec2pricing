import React from 'react';
import './App.css';
import { PriceInfo } from './api';
import { useTable, Column, useSortBy } from 'react-table';

import './PricingTable.css';

type PricingTableProps = {
  data: PriceInfo[]
}


export default function PricingTable({ data }: PricingTableProps) {
  const columns: Column<PriceInfo>[] = React.useMemo(() => [
    {
      Header: 'Region',
      accessor: 'region',
    },
    {
      Header: 'Instance type',
      accessor: 'type',
    },
    {
      Header: 'Size',
      accessor: 'size',
    },
    {
      Header: 'Operating system',
      accessor: 'os',
    },
    {
      Header: 'Price (USD)',
      accessor: 'price',
    },
  ], [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"></div>
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} >
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} scope="col" className="px-6 py-3 text-sm text-bold font-medium text-gray-500 uppercase tracking-wider">
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {rows.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} className="pricing-table-row">
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm">
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}
