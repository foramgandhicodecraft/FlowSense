import React, { useState, useEffect } from 'react';
import { getForecast } from '../services/api';
import ForecastChart from '../components/ForecastChart';
import toast from 'react-hot-toast';
import { RefreshCw, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async (force = false) => {
    try {
      const data = await getForecast(force);
      setForecast(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load forecast data');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    fetchForecast(true);
    toast.success('Regenerating forecast with latest data...');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-borderColor border-t-accentBlue rounded-full animate-spin"></div>
      </div>
    );
  }

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'safe': return <ShieldCheck className="text-accentGreen" size={24} />;
      case 'caution': return <AlertTriangle className="text-accentYellow" size={24} />;
      case 'danger': return <ShieldAlert className="text-accentRed" size={24} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Cash Flow Forecast</h1>
          <p className="text-textSecondary mt-1">Predictive analysis powered by LSTM Model</p>
        </div>
        <button 
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-2 px-4 py-2 bg-bgCard hover:bg-bgCardHover border border-borderColor rounded-lg text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={regenerating ? 'animate-spin' : ''} />
          {regenerating ? 'Analyzing...' : 'Regenerate Forecast'}
        </button>
      </div>

      <div className="glass-card p-6 rounded-xl mb-6">
        <div className="h-80">
          <ForecastChart data={forecast?.monthly_breakdown || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forecast?.monthly_breakdown?.map((month, index) => (
          <div key={index} className="glass-card p-6 rounded-xl flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              month.risk === 'danger' ? 'bg-accentRed/10' : 
              month.risk === 'caution' ? 'bg-accentYellow/10' : 'bg-accentGreen/10'
            }`}>
              {getRiskIcon(month.risk)}
            </div>
            <div>
              <h3 className="text-lg font-heading text-white">{month.month}</h3>
              <p className={`text-2xl font-bold mt-1 ${
                month.amount >= 0 ? 'text-accentGreen' : 'text-accentRed'
              }`}>
                {month.amount >= 0 ? '+' : '-'}₹{Math.abs(month.amount).toLocaleString('en-IN')}
              </p>
              <span className={`text-xs uppercase font-bold mt-2 inline-block px-2 py-1 rounded ${
                month.risk === 'danger' ? 'bg-accentRed text-white' : 
                month.risk === 'caution' ? 'bg-accentYellow text-bgPrimary' : 'bg-accentGreen text-bgPrimary'
              }`}>
                {month.risk} ZONE
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-semibold text-white mb-2">Model Confidence Score</h3>
          <p className="text-textSecondary text-sm max-w-2xl">
            Our LSTM + XGBoost engine calculates predictions based on your transaction history, market trends, and seasonal patterns.
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <div className="flex justify-between mb-2">
            <span className="text-white font-medium">{forecast?.confidence_percent || 0}% Accuracy</span>
            <span className="text-textSecondary text-sm">High</span>
          </div>
          <div className="h-3 w-full bg-bgPrimary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accentBlue to-accentGreen rounded-full shadow-glowBlue"
              style={{ width: `${forecast?.confidence_percent || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
