import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TransactionTable = ({ transactions, filter = 'all', limit = null }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center p-8 text-textSecondary">No transactions found</div>;
  }

  const filteredTxs = transactions.filter(t => {
    if (filter === 'income') return t.amount > 0;
    if (filter === 'expense') return t.amount < 0;
    return true;
  });

  const displayTxs = limit ? filteredTxs.slice(0, limit) : filteredTxs;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'income': 'bg-accentGreen/20 text-accentGreen',
      'tax': 'bg-accentRed/20 text-accentRed',
      'raw_material': 'bg-accentYellow/20 text-accentYellow',
      'salary': 'bg-purple-500/20 text-purple-400',
      'utility': 'bg-blue-500/20 text-blue-400',
      'loan_repayment': 'bg-orange-500/20 text-orange-400',
      'other': 'bg-gray-500/20 text-gray-400'
    };
    return colors[category] || colors['other'];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-textSecondary border-b border-borderColor">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Description</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium text-right">Amount</th>
            <th className="pb-3 font-medium text-center">Source</th>
          </tr>
        </thead>
        <tbody>
          {displayTxs.map((tx) => (
            <tr key={tx.id} className="border-b border-borderColor/50 hover:bg-bgCard/50 transition-colors">
              <td className="py-4 text-sm">{formatDate(tx.date)}</td>
              <td className="py-4 font-medium">{tx.description}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded text-xs capitalize ${getCategoryColor(tx.category)}`}>
                  {tx.category.replace('_', ' ')}
                </span>
              </td>
              <td className="py-4 text-right font-semibold">
                <div className="flex items-center justify-end gap-1">
                  {tx.amount > 0 ? (
                    <ArrowUpRight size={16} className="text-accentGreen" />
                  ) : (
                    <ArrowDownRight size={16} className="text-accentRed" />
                  )}
                  <span className={tx.amount > 0 ? 'text-accentGreen' : 'text-white'}>
                    ₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </td>
              <td className="py-4 text-center">
                <span className="text-xs text-textSecondary uppercase bg-bgPrimary px-2 py-1 rounded border border-borderColor">
                  {tx.source}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
