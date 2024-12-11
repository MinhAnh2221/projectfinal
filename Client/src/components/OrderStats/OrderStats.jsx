import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './OrderStats.module.css';

const OrderStats = ({ orders }) => {
  // Calculate totals
  const calculateTotals = () => {
    const totals = orders.reduce((acc, order) => {
      if (order.statusPaid === 'pending') {
        acc.pendingTotal += order.totalPrice;
        acc.pendingCount++;
      } else if (order.statusPaid === 'paid') {
        acc.paidTotal += order.totalPrice;
        acc.paidCount++;
      }
      return acc;
    }, {
      pendingTotal: 0,
      paidTotal: 0,
      pendingCount: 0,
      paidCount: 0
    });

    return [
      {
        status: 'Pending',
        total: totals.pendingTotal,
        count: totals.pendingCount,
        color: '#FFA500'
      },
      {
        status: 'Paid',
        total: totals.paidTotal,
        count: totals.paidCount,
        color: '#4CAF50'
      }
    ];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'vnd',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const data = calculateTotals();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Order Payment Status Overview</h2>
        
        <div className={styles.statsGrid}>
          {data.map((item) => (
            <div key={item.status} className={styles.statCard}>
              <h3 className={styles.statTitle}>{item.status} Orders</h3>
              <p className={styles.statValue}>{formatCurrency(item.total)}</p>
              <p className={styles.statCount}>{item.count} orders</p>
            </div>
          ))}
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis 
                tickFormatter={formatCurrency}
                width={100}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ color: '#111' }}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                name="Total Amount"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;