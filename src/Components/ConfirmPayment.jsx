import React, { useState } from 'react';
import styles from './ConfirmPayment.module.css';
import { ArrowLeft, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

const ConfirmPayment = ({ recipientData, onConfirm, onBack }) => {
  // recipientData now comes from the API via onScanSuccess in ScanQRCode.jsx
  // Expected fields: receiver, bank_name, account, bank_code
  
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    // Pass the user-entered amount to the final payment logic
    onConfirm({ ...recipientData, amount: parseFloat(amount) });
  };

  return (
    <div className={styles.container}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft />
        </button>
        <h1 style={{ fontSize: '20px' }}>Checkout</h1>
      </header>

      {/* Verified Recipient Card */}
      <div className={styles.recipientBox} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: '#6366f1', 
            borderRadius: '12px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontWeight: 'bold',
            color: 'white' 
          }}>
            {(recipientData.receiver || "U").substring(0,2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <p style={{ fontWeight: 'bold', color: 'white' }}>{recipientData.receiver || "Unknown Recipient"}</p>
              <CheckCircle2 size={14} color="#22c55e" fill="#22c55e22" />
            </div>
            {/* 👈 BANK NAME ADDED HERE UNDER THE RECEIVER */}
            <p style={{ color: '#6366f1', fontSize: '12px', fontWeight: '600' }}>
              {recipientData.bank_name || "Fetching Bank..." }
            </p>
            <p style={{ color: '#aaa', fontSize: '12px' }}>
              A/C: {recipientData.account || "••••••••••"}
            </p>
          </div>
        </div>
        <ShieldCheck color="#22c55e" size={24} />
      </div>

      {/* Editable Amount Section */}
      <div className={styles.amountCard} style={{ marginTop: '24px' }}>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Enter Amount to Pay</p>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #6366f1', paddingBottom: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginRight: '8px' }}>₦</span>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={styles.amountInput}
            autoFocus
            style={{
              background: 'none',
              border: 'none',
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#94a3b8' }}>
          <Info size={14} />
          <p style={{ fontSize: '12px' }}>This merchant is verified .</p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <button 
          className={styles.confirmBtn} 
          onClick={handleConfirm}
          disabled={!amount}
          style={{
            opacity: !amount ? 0.6 : 1,
            backgroundColor: '#6366f1',
            transition: 'all 0.3s ease'
          }}
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;