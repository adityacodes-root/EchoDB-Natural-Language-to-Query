import { motion } from 'framer-motion';
import { Table, BarChart3, Columns, Download } from 'lucide-react';
import { Button } from './ui/button';
import { DynamicChart } from './dynamic-chart';
import { Config, Result } from '@/lib/types';
import { useState } from 'react';

interface ResultsProps {
  results: Result[] | null;
  chartConfig: Config | null;
  columns: string[];
}

const formatValue = (column: string, value: string | number) => {
  if (column === 'valuation') {
    return `$${Number(value).toFixed(1)}B`;
  }
  return value?.toString() || '';
};

export function Results({ results, chartConfig, columns }: ResultsProps) {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  if (!results || !Array.isArray(results) || results.length === 0) {
    return null;
  }

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = columns;
      const csvContent = [
        headers.join(','),
        ...results.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] ?? '')
          ).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `query-results.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(results, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `query-results.json`;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Columns className="h-4 w-4" />
          <span>Selected columns: {columns.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('json')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>JSON</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}
            className="flex items-center gap-2"
          >
            {viewMode === 'table' ? (
              <>
                <BarChart3 className="h-4 w-4" />
                <span>Show Chart</span>
              </>
            ) : (
              <>
                <Table className="h-4 w-4" />
                <span>Show Table</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {viewMode === 'chart' && chartConfig ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <DynamicChart chartData={results} chartConfig={chartConfig} />
          </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
              {results.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                    >
                      {formatValue(column, row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
    </div>
      )}
    </motion.div>
  );
}

