/**
 * Returns a simple data table component
 * This component is used to display a simple table with no sorting, filtering, or pagination.
 * @param {title, columns, data} props - Passed props
 *
 * @returns {JSX} - Custom data table component
 */

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface SimpleTableProps {
  title?: string;
  columns: any[];
  data: any[];
  parentClassName?: string;
}

export default function SimpleTable({
  title,
  columns,
  data,
  parentClassName,
}: SimpleTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="border border-outline rounded-lg overflow-auto">
        <div className={cn('relative max-h-80', parentClassName)}>
          <Table className="w-full border-collapse">
            <TableHeader className="sticky top-0 bg-foreground z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      className="py-3 px-6 text-sm font-semibold uppercase"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="overflow-y-auto">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className='border-outline'>
                    {row.getVisibleCells().map((cell, idx, cells) => {
                        const isLast = idx === cells.length - 1;

                        return (
                            <TableCell
                            key={cell.id}
                            className={cn(
                                "py-3 text-sm",
                                isLast ? "text-right pr-6" : "pl-6"
                            )}
                            >
                            <div className={cn(!isLast && "flex flex-col gap-1")}>
                                {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                                )}
                            </div>
                            </TableCell>
                        );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-3"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
