import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, FileText, Smartphone, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadCSV } from '../services/api';

const Connect = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [connections, setConnections] = useState({
    gst: false,
    bank: false,
    upi: false,
    csv: false
  });
  
  const [loading, setLoading] = useState({
    gst: false,
    bank: false,
    upi: false,
    csv: false
  });

  const handleConnect = (type) => {
    setLoading({ ...loading, [type]: true });
    setTimeout(() => {
      setLoading({ ...loading, [type]: false });
      setConnections({ ...connections, [type]: true });
      toast.success(`${type.toUpperCase()} connected successfully!`);
    }, 1500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading({ ...loading, csv: true });
    try {
      const res = await uploadCSV(file);
      if (res.success) {
        setConnections({ ...connections, csv: true });
        toast.success(`Uploaded ${res.added} transactions!`);
      }
    } catch (error) {
      toast.error('Failed to upload CSV');
    } finally {
      setLoading({ ...loading, csv: false });
    }
  };



  const hasAnyConnection = Object.values(connections).some(v => v);

  return (
    <div className="min-h-screen bg-bgPrimary p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Connect Your Data</h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            FlowSense needs your transaction history to generate accurate cash flow predictions. 
            Connect your accounts securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* GST Card */}
          <div className={`glass-card p-6 rounded-2xl transition-all ${connections.gst ? 'border-accentGreen' : ''}`}>
            <div className="w-12 h-12 rounded-xl bg-accentBlue/20 flex items-center justify-center mb-6">
              <FileText className="text-accentBlue" size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">GST Portal</h3>
            <p className="text-textSecondary text-sm mb-6 h-10">
              Connect to fetch verified invoices and tax payments automatically.
            </p>
            <button 
              onClick={() => handleConnect('gst')}
              disabled={connections.gst || loading.gst}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                ${connections.gst ? 'bg-accentGreen/20 text-accentGreen' : 'bg-accentBlue text-white hover:bg-blue-600'}`}
            >
              {loading.gst ? <span className="animate-pulse">Connecting...</span> : 
               connections.gst ? <><CheckCircle size={18} /> Connected</> : 'Connect GST'}
            </button>
          </div>

          {/* Bank Card */}
          <div className={`glass-card p-6 rounded-2xl transition-all ${connections.bank ? 'border-accentGreen' : ''}`}>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
              <Landmark className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">Bank Account</h3>
            <p className="text-textSecondary text-sm mb-6 h-10">
              Link your current account via secure Account Aggregator.
            </p>
            <button 
              onClick={() => handleConnect('bank')}
              disabled={connections.bank || loading.bank}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                ${connections.bank ? 'bg-accentGreen/20 text-accentGreen' : 'bg-purple-600 text-white hover:bg-purple-500'}`}
            >
              {loading.bank ? <span className="animate-pulse">Connecting...</span> : 
               connections.bank ? <><CheckCircle size={18} /> Connected</> : 'Connect Bank'}
            </button>
          </div>

          {/* UPI Card */}
          <div className={`glass-card p-6 rounded-2xl transition-all ${connections.upi ? 'border-accentGreen' : ''}`}>
            <div className="w-12 h-12 rounded-xl bg-accentYellow/20 flex items-center justify-center mb-6">
              <Smartphone className="text-accentYellow" size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">UPI History</h3>
            <p className="text-textSecondary text-sm mb-6 h-10">
              Connect your merchant UPI app for daily retail transactions.
            </p>
            <button 
              onClick={() => handleConnect('upi')}
              disabled={connections.upi || loading.upi}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                ${connections.upi ? 'bg-accentGreen/20 text-accentGreen' : 'bg-accentYellow text-bgPrimary hover:bg-yellow-500'}`}
            >
              {loading.upi ? <span className="animate-pulse">Connecting...</span> : 
               connections.upi ? <><CheckCircle size={18} /> Connected</> : 'Connect UPI'}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading.csv}
            className="px-6 py-3 rounded-xl border border-borderColor text-white hover:bg-bgCard flex items-center gap-2 transition-colors"
          >
            {loading.csv ? 'Uploading...' : <><Upload size={18} /> Upload CSV Instead</>}
          </button>
          

        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            disabled={!hasAnyConnection}
            className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${
              hasAnyConnection 
                ? 'bg-accentGreen text-bgPrimary hover:bg-emerald-400 hover:scale-105 shadow-glowGreen' 
                : 'bg-bgCard text-textSecondary cursor-not-allowed'
            }`}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connect;
