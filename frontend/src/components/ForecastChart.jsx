import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ForecastChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-textSecondary">
        No forecast data available
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map((d, index) => {
    // Determine risk color
    const color = d.risk === 'danger' ? '#FF5C5C' : (d.risk === 'caution' ? '#FFB547' : '#00C896');
    return {
      name: d.month || `Month ${index + 1}`,
      amount: d.amount,
      color: color
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bgCard border border-borderColor p-4 rounded-lg shadow-xl">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-accentBlue font-bold text-lg">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#A0AEC0" 
            tick={{ fill: '#A0AEC0', fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis 
            stroke="#A0AEC0" 
            tick={{ fill: '#A0AEC0', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${(value / 1000)}k`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#4F8EF7" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#111C44', strokeWidth: 2, stroke: '#4F8EF7' }}
            activeDot={{ r: 6, fill: '#4F8EF7', strokeWidth: 0 }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(79,142,247,0.5))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
