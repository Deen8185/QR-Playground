import React from 'react';
import styles from './SuccessPage.module.css';
import { CheckCircle2 } from 'lucide-react';

const SuccessPage = ({ recipient, onDone }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconCircle}>
        <CheckCircle2 size={80} color="#22c55e" />
      </div>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Success!</h1>
      <p style={{ color: '#888' }}>Sent to <span style={{ color: 'white' }}>{recipient}</span></p>

      <div className={styles.receiptCard}>
        <div className={styles.row}><span>Amount</span><span>₦15,000.00</span></div>
        <div className={styles.row} style={{ border: 'none' }}><span>Status</span><span style={{ color: '#22c55e' }}>Completed</span></div>
      </div>

      <button 
        style={{ width: '100%', backgroundColor: '#5d3fd3', padding: '20px', borderRadius: '20px', border: 'none', color: 'white', fontWeight: 'bold' }} 
        onClick={onDone}
      >
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;