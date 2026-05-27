import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    try {
      await login(phone);
      toast.success('Logged in successfully!');
      navigate('/connect');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accentBlue/20 blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accentGreen/10 blur-[120px]"></div>

      <div className="glass-card p-10 rounded-2xl w-full max-w-md z-10 mx-4 border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accentBlue to-accentGreen flex items-center justify-center mx-auto mb-6 shadow-glowBlue">
            <span className="text-white text-3xl font-bold font-heading">F</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">FlowSense</h1>
          <p className="text-textSecondary">Know your next 90 days.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary font-medium">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-bgPrimary border border-borderColor rounded-xl py-3 pl-14 pr-4 text-white focus:outline-none focus:border-accentBlue focus:ring-1 focus:ring-accentBlue transition-all"
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full bg-accentBlue hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <p className="text-center text-xs text-textSecondary mt-8">
          Any 10-digit number works for this demo
        </p>
      </div>
    </div>
  );
};

export default Login;
