import React from 'react';
import styles from './SuccessPage.module.css';
import { CheckCircle2 } from 'lucide-react';

const SuccessPage = ({ recipient, amount, onDone }) => {
  // Format the amount as currency
  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount || 0);

  return (
    <div className={styles.container}>
      <div className={styles.iconCircle}>
        <CheckCircle2 size={80} color="#22c55e" className={styles.animateCheck} />
      </div>
      
      <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>Payment Successful</h1>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>
        Your transfer to <span style={{ color: 'white', fontWeight: '600' }}>{recipient || 'the recipient'}</span> was successful.
      </p>

      <div className={styles.receiptCard}>
        <div className={styles.row}>
          <span style={{ color: '#64748b' }}>Amount Sent</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{formattedAmount}</span>
        </div>
        <div className={styles.row} style={{ border: 'none' }}>
          <span style={{ color: '#64748b' }}>Transaction Status</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Completed</span>
        </div>
        <div className={styles.row} style={{ borderTop: '1px dashed #334155', paddingTop: '15px' }}>
          <span style={{ color: '#64748b' }}>Reference ID</span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>BRDG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
        </div>
      </div>

      <button 
        style={{ 
          width: '100%', 
          backgroundColor: '#5d3fd3', 
          padding: '20px', 
          borderRadius: '20px', 
          border: 'none', 
          color: 'white', 
          fontWeight: 'bold',
          marginTop: 'auto',
          cursor: 'pointer'
        }} 
        onClick={onDone}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default SuccessPage;