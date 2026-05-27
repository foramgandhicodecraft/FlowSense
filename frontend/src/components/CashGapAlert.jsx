import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CashGapAlert = ({ forecast }) => {
  const navigate = useNavigate();

  if (!forecast || (forecast.risk_level !== 'danger' && forecast.risk_level !== 'caution')) return null;

  const isDanger = forecast.risk_level === 'danger';
  const bgColor = isDanger ? 'bg-accentRed/10' : 'bg-accentYellow/10';
  const borderColor = isDanger ? 'border-accentRed/30' : 'border-accentYellow/30';
  const textColor = isDanger ? 'text-accentRed' : 'text-accentYellow';
  
  return (
    <div className={`mt-6 w-full ${bgColor} border ${borderColor} rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card-hover`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isDanger ? 'bg-accentRed/20' : 'bg-accentYellow/20'}`}>
          <AlertTriangle className={textColor} size={24} />
        </div>
        <div>
          <h3 className={`text-lg font-heading font-semibold ${textColor}`}>
            Cash Gap Predicted in {forecast.cash_gap_day} Days
          </h3>
          <p className="text-white mt-1 text-sm md:text-base">
            {forecast.recommendation || `You may run short by ₹${Math.abs(forecast.cash_gap_amount || 0).toLocaleString('en-IN')}.`}
          </p>
        </div>
      </div>
      <button 
        onClick={() => navigate('/loans')}
        className={`shrink-0 px-6 py-3 rounded-lg font-medium transition-transform hover:scale-105 ${
          isDanger ? 'bg-accentRed text-white hover:bg-red-600' : 'bg-accentYellow text-bgPrimary hover:bg-yellow-500'
        }`}
      >
        See Loan Options
      </button>
    </div>
  );
};

export default CashGapAlert;
