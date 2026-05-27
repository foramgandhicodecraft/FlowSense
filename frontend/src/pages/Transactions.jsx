import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import toast from 'react-hot-toast';
import { ArrowDownRight, ArrowUpRight, Filter, Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-white">Transactions</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/connect')}
            className="flex items-center gap-2 px-4 py-2 bg-bgCard hover:bg-bgCardHover border border-borderColor rounded-lg text-white transition-colors"
          >
            <Upload size={18} /> Upload CSV
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-accentBlue hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            <Plus size={18} /> Add Manual
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-textSecondary text-sm mb-1">Total Income</p>
            <p className="text-xl font-bold text-accentGreen">₹{totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-accentGreen/10 rounded-lg"><ArrowUpRight className="text-accentGreen" /></div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-textSecondary text-sm mb-1">Total Expense</p>
            <p className="text-xl font-bold text-accentRed">₹{totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-accentRed/10 rounded-lg"><ArrowDownRight className="text-accentRed" /></div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-textSecondary text-sm mb-1">Net Flow</p>
            <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-accentGreen' : 'text-accentRed'}`}>
              {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-3 bg-accentBlue/10 rounded-lg"><Filter className="text-accentBlue" /></div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-borderColor flex items-center gap-2">
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors
                ${filter === f ? 'bg-accentBlue text-white' : 'text-textSecondary hover:bg-bgCardHover'}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-10"><div className="inline-block w-8 h-8 border-4 border-borderColor border-t-accentBlue rounded-full animate-spin"></div></div>
          ) : (
            <TransactionTable transactions={transactions} filter={filter} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
