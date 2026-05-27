import React from 'react';
import { ExternalLink, Landmark } from 'lucide-react';

const LoanCard = ({ loan }) => {
  return (
    <div className="glass-card rounded-xl p-6 glass-card-hover flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-accentBlue/20 flex items-center justify-center">
          <Landmark className="text-accentBlue" size={20} />
        </div>
        <div>
          <h4 className="text-white font-heading font-semibold">{loan.provider || 'Bank'}</h4>
          <p className="text-xs text-textSecondary">{loan.type || 'Business Loan'}</p>
        </div>
      </div>
      
      <div className="mb-6 flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{loan.name || 'MSME Term Loan'}</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-bgPrimary rounded-lg p-3">
            <p className="text-xs text-textSecondary mb-1">Interest Rate</p>
            <p className="text-accentGreen font-bold">{loan.rate || '10.5% p.a.'}</p>
          </div>
          <div className="bg-bgPrimary rounded-lg p-3">
            <p className="text-xs text-textSecondary mb-1">Max Amount</p>
            <p className="text-white font-bold">{loan.amount || '₹10,00,000'}</p>
          </div>
        </div>
      </div>
      
      <button className="w-full py-3 rounded-lg bg-accentBlue/10 text-accentBlue font-medium hover:bg-accentBlue hover:text-white transition-colors flex items-center justify-center gap-2">
        Apply Now <ExternalLink size={16} />
      </button>
    </div>
  );
};

export default LoanCard;
