import React, { useState, useEffect } from 'react';
import { getAlerts, markAlertsRead } from '../services/api';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAlertsRead();
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
      toast.success('All alerts marked as read');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'red': return <AlertCircle className="text-accentRed" size={24} />;
      case 'yellow': return <AlertTriangle className="text-accentYellow" size={24} />;
      case 'green': return <CheckCircle className="text-accentGreen" size={24} />;
      default: return <Info className="text-accentBlue" size={24} />;
    }
  };

  const getBorderColor = (severity) => {
    switch (severity) {
      case 'red': return 'border-l-accentRed';
      case 'yellow': return 'border-l-accentYellow';
      case 'green': return 'border-l-accentGreen';
      default: return 'border-l-accentBlue';
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.is_read;
    if (filter === 'red') return a.severity === 'red';
    if (filter === 'yellow') return a.severity === 'yellow';
    if (filter === 'green') return a.severity === 'green';
    return true;
  });

  if (loading) {
    return <div className="h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-borderColor border-t-accentBlue rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-white">Smart Alerts</h1>
        <button 
          onClick={handleMarkAllRead}
          className="text-sm font-medium text-textSecondary hover:text-white transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'unread', 'red', 'yellow', 'green'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors
              ${filter === f ? 'bg-accentBlue text-white' : 'bg-bgCard text-textSecondary hover:bg-bgCardHover'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-textSecondary glass-card rounded-xl">
            No alerts match the selected filter.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`glass-card p-5 rounded-xl border-l-4 ${getBorderColor(alert.severity)} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-opacity ${alert.is_read ? 'opacity-70' : 'opacity-100'}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getAlertIcon(alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-textSecondary">
                      {alert.type.replace('_', ' ')}
                    </span>
                    {!alert.is_read && (
                      <span className="w-2 h-2 rounded-full bg-accentBlue shadow-glowBlue"></span>
                    )}
                  </div>
                  <p className="text-white text-lg">{alert.message}</p>
                  <p className="text-xs text-textSecondary mt-2">
                    {new Date(alert.created_at).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {alert.action_text && (
                <button className="shrink-0 px-4 py-2 bg-bgPrimary border border-borderColor rounded-lg text-sm font-medium text-white hover:bg-accentBlue transition-colors">
                  {alert.action_text}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
