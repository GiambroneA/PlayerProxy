import React from 'react';

export interface StatRow {
  category: string;
  value: string | number;
}

interface StatsTableProps {
  title: string;
  data: StatRow[];
  size?: 'small' | 'medium' | 'large';
}

const StatsTable: React.FC<StatsTableProps> = ({ title, data, size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-blue-500">
      <h3 className="text-xl font-bold text-white p-4 border-b border-blue-500">
        {title}
      </h3>
      <div className="p-4">
        <table className="w-full">
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row.category} 
                className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}
              >
                <td className={`p-3 font-medium text-blue-300 ${sizeClasses[size]}`}>
                  {row.category}
                </td>
                <td className={`p-3 text-white text-right font-semibold ${sizeClasses[size]}`}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;