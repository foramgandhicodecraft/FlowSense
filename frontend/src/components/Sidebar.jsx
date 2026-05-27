import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Bell, CreditCard, Receipt, Link as LinkIcon, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const businessName = localStorage.getItem('business_name') || 'Your Business';
  const phone = localStorage.getItem('user_id');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/forecast', label: 'Forecast', icon: <TrendingUp size={20} /> },
    { path: '/alerts', label: 'Alerts', icon: <Bell size={20} /> },
    { path: '/loans', label: 'Loan Score', icon: <CreditCard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { path: '/connect', label: 'Connect Data', icon: <LinkIcon size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="w-64 bg-[#0A1128] border-r border-borderColor h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accentBlue to-accentGreen flex items-center justify-center">
            <span className="text-white text-lg">F</span>
          </div>
          FlowSense
        </h1>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-bgCard text-accentBlue border-l-4 border-accentBlue'
                      : 'text-textSecondary hover:bg-bgCard hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-borderColor mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">{businessName}</p>
            <p className="text-xs text-textSecondary">{phone}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-textSecondary hover:text-accentRed transition-colors rounded-lg hover:bg-bgCard"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
