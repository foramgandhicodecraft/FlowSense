import React, { useState, useEffect } from 'react';
import { getForecast, getTransactions, getAlerts } from '../services/api';
import CashGapAlert from '../components/CashGapAlert';
import ForecastChart from '../components/ForecastChart';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [forecast, setForecast] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fData, tData, aData] = await Promise.all([
          getForecast(),
          getTransactions(),
          getAlerts()
        ]);
        setForecast(fData);
        setTransactions(tData);
        setAlerts(aData.slice(0, 4)); // top 4 alerts
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-borderColor border-t-accentBlue rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate stats
  const currentBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const nextBigPayment = transactions.filter(t => t.amount < -10000).sort((a,b) => b.amount - a.amount)[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-white">Dashboard</h1>
        <p className="text-textSecondary text-sm">Powered by LSTM + XGBoost Engine</p>
      </div>

      <CashGapAlert forecast={forecast} />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <Wallet size={18} />
            <span className="font-medium">Current Balance</span>
          </div>
          <h2 className="text-3xl font-bold text-white">₹{currentBalance.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-textSecondary mt-2">Based on connected accounts</p>
        </div>

        {/* 30-Day Forecast Card */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <TrendingUp size={18} />
            <span className="font-medium">30-Day Net Forecast</span>
          </div>
          {forecast?.day_30_amount ? (
            <div className="flex items-end gap-2">
              <h2 className={`text-3xl font-bold ${forecast.day_30_amount >= 0 ? 'text-accentGreen' : 'text-accentRed'}`}>
                {forecast.day_30_amount >= 0 ? '+' : '-'}₹{Math.abs(forecast.day_30_amount).toLocaleString('en-IN')}
              </h2>
            </div>
          ) : (
            <h2 className="text-3xl font-bold text-white">N/A</h2>
          )}
          <p className="text-xs text-textSecondary mt-2">AI predicted cash change</p>
        </div>

        {/* Cash Gap Warning Card */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <AlertCircle size={18} />
            <span className="font-medium">Cash Gap Warning</span>
          </div>
          {forecast?.cash_gap_day ? (
            <div>
              <h2 className="text-2xl font-bold text-accentRed">Gap in {forecast.cash_gap_day} Days</h2>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-accentGreen">No gap predicted</h2>
            </div>
          )}
          <p className="text-xs text-textSecondary mt-2">Next 90 days outlook</p>
        </div>

        {/* Big Payment Card */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <Calendar size={18} />
            <span className="font-medium">Recent Big Payment</span>
          </div>
          {nextBigPayment ? (
            <div>
              <h2 className="text-xl font-bold text-white truncate">{nextBigPayment.description}</h2>
              <p className="text-accentRed font-semibold">-₹{Math.abs(nextBigPayment.amount).toLocaleString('en-IN')}</p>
            </div>
          ) : (
            <h2 className="text-xl font-bold text-white">None found</h2>
          )}
          <p className="text-xs text-textSecondary mt-2">from history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-semibold text-white">90-Day Cash Forecast</h3>
            <Link to="/forecast" className="text-sm text-accentBlue hover:underline">View details</Link>
          </div>
          <ForecastChart data={forecast?.monthly_breakdown || []} />
        </div>

        {/* Alerts Area */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-semibold text-white">Smart Alerts</h3>
            <Link to="/alerts" className="text-sm text-accentBlue hover:underline">See all</Link>
          </div>
          
          <div className="space-y-4">
            {alerts.length > 0 ? alerts.map(alert => (
              <div key={alert.id} className="border-l-2 border-accentBlue pl-4 py-2">
                <p className="text-sm text-white mb-1">{alert.message}</p>
                <span className="text-xs text-accentBlue font-medium cursor-pointer hover:underline">
                  {alert.action_text}
                </span>
              </div>
            )) : (
              <p className="text-textSecondary text-sm text-center py-4">No new alerts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
