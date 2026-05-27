import React, { useState, useEffect } from 'react';
import { getLoanScore } from '../services/api';
import LoanCard from '../components/LoanCard';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoanScore = () => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const data = await getLoanScore();
        setScoreData(data);
      } catch (error) {
        toast.error('Failed to load loan score');
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-borderColor border-t-accentBlue rounded-full animate-spin"></div></div>;
  }

  if (!scoreData) {
    return <div className="p-8 text-center text-textSecondary">No score data available.</div>;
  }

  const score = scoreData.score || 0;
  let gaugeColor = 'stroke-accentRed';
  let gaugeGlow = 'drop-shadow-[0_0_15px_rgba(255,92,92,0.5)]';
  if (score > 40) {
    gaugeColor = 'stroke-accentYellow';
    gaugeGlow = 'drop-shadow-[0_0_15px_rgba(255,181,71,0.5)]';
  }
  if (score > 70) {
    gaugeColor = 'stroke-accentGreen';
    gaugeGlow = 'drop-shadow-[0_0_15px_rgba(0,200,150,0.5)]';
  }

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-white mb-2">Loan Readiness Score</h1>
        <p className="text-textSecondary">Powered by XGBoost Credit Engine</p>
      </div>

      {/* Gauge Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="90"
              fill="transparent"
              stroke="var(--bg-card)"
              strokeWidth="12"
            />
            <circle
              cx="100" cy="100" r="90"
              fill="transparent"
              className={`${gaugeColor} ${gaugeGlow} transition-all duration-1000 ease-out`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold font-heading text-white">{score}</span>
            <span className="text-sm text-textSecondary mt-1">out of 100</span>
          </div>
        </div>
        <div className="mt-6 px-6 py-2 rounded-full bg-bgCard border border-borderColor inline-flex items-center gap-2">
          {score > 70 ? <CheckCircle2 className="text-accentGreen" /> : 
           score > 40 ? <AlertTriangle className="text-accentYellow" /> : 
           <XCircle className="text-accentRed" />}
          <span className="font-bold text-lg text-white">{scoreData.label}</span>
        </div>
      </div>

      {/* Reasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {scoreData.reasons?.map((reason, idx) => (
          <div key={idx} className="glass-card p-5 rounded-xl flex items-start gap-4">
            <div className={`mt-1 rounded-full p-1 
              ${reason.status === 'good' ? 'bg-accentGreen/20 text-accentGreen' : 
                reason.status === 'warning' ? 'bg-accentYellow/20 text-accentYellow' : 
                'bg-accentRed/20 text-accentRed'}`}>
              {reason.status === 'good' ? <CheckCircle2 size={16} /> : 
               reason.status === 'warning' ? <AlertTriangle size={16} /> : 
               <XCircle size={16} />}
            </div>
            <p className="text-white">{reason.text}</p>
          </div>
        ))}
      </div>

      {/* Loan Offers */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-6">Recommended Loan Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scoreData.suggested_loans?.map((loan, idx) => (
            <LoanCard key={idx} loan={loan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanScore;
