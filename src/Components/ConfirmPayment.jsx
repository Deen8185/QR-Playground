import React from 'react';
import styles from './ConfirmPayment.module.css';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const ConfirmPayment = ({ recipientData, onConfirm, onBack }) => {
  return (
    <div className={styles.container}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white' }}><ArrowLeft /></button>
        <h1 style={{ fontSize: '20px' }}>Confirm Payment</h1>
      </header>

      <div className={styles.recipientBox}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#5d3fd3', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            {recipientData.name.substring(0,2).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>{recipientData.name}</p>
            <p style={{ color: '#666', fontSize: '12px' }}>{recipientData.bank} • {recipientData.accountNumber}</p>
          </div>
        </div>
        <CheckCircle2 color="#22c55e" />
      </div>

      <div className={styles.amountCard}>
        <p style={{ opacity: 0.7, fontSize: '14px' }}>Amount</p>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', margin: '8px 0' }}>₦15,000.00</h2>
      </div>

      <button className={styles.confirmBtn} onClick={onConfirm}>Confirm to Pay</button>
    </div>
  );
};

export default ConfirmPayment;